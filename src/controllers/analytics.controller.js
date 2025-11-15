const prisma = require('../prisma/client');

// collect event
exports.collectEvent = async (req, res, next) => {
  try {
    const payload = req.body;
    // minimal validation
    if (!payload.event || !payload.timestamp) {
      return res.status(400).json({ error: 'event and timestamp are required' });
    }
    const timestamp = new Date(payload.timestamp);
    await prisma.event.create({
      data: {
        appId: req.appEntity.id,
        event: payload.event,
        url: payload.url,
        referrer: payload.referrer,
        device: payload.device,
        ipAddress: payload.ipAddress,
        timestamp,
        metadata: payload.metadata || {},
        userId: payload.userId || null
      }
    });
    return res.status(201).json({ success: true });
  } catch (err) {
    next(err);
  }
};

// event summary
exports.eventSummary = async (req, res, next) => {
  try {
    const { event, startDate, endDate, app_id } = req.query;
    if (!event) return res.status(400).json({ error: 'event query param required' });

    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate + 'T23:59:59Z') : new Date();

    // Build where clause
    const where = {
      event,
      timestamp: { gte: start, lte: end }
    };
    if (app_id) where.appId = app_id;

    // total count
    const total = await prisma.event.count({ where });

    // unique users
    const uniqueUsersRows = await prisma.event.groupBy({
      by: ['userId'],
      where: where,
      _count: { userId: true },
      take: 1
    }).catch(()=>[]);

    // uniqueUsers: count of distinct userId that are not null
    const uniqueUsers = await prisma.event.count({
      where: { ...where, NOT: { userId: null } , },
      distinct: ['userId']
    });

    // device aggregation
    // raw SQL might be more efficient; use Prisma raw query for grouping
    const deviceData = await prisma.$queryRaw`
      SELECT device, COUNT(*) AS cnt
      FROM "Event"
      WHERE event = ${event} AND timestamp >= ${start} AND timestamp <= ${end}
      ${app_id ? `AND "appId" = ${app_id}` : ''}
      GROUP BY device
    `;

    // format deviceData
    const deviceDataFormatted = {};
    deviceData.forEach(d => { deviceDataFormatted[d.device || 'unknown'] = Number(d.cnt); });

    return res.json({
      event,
      count: total,
      uniqueUsers,
      deviceData: deviceDataFormatted
    });
  } catch (err) {
    next(err);
  }
};

// user-stats
exports.userStats = async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const totalEvents = await prisma.event.count({ where: { userId } });

    const recentEvents = await prisma.event.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: { event: true, timestamp: true, device: true, ipAddress: true, metadata: true }
    });

    // device details: infer most common browser/os from metadata
    const eventsWithMeta = await prisma.event.findMany({
      where: { userId, NOT: { metadata: null } },
      select: { metadata: true }
    });

    const deviceCounts = { browser: {}, os: {} };
    eventsWithMeta.forEach(e => {
      const meta = e.metadata || {};
      if (meta.browser) deviceCounts.browser[meta.browser] = (deviceCounts.browser[meta.browser] || 0) + 1;
      if (meta.os) deviceCounts.os[meta.os] = (deviceCounts.os[meta.os] || 0) + 1;
    });

    const topBrowser = Object.entries(deviceCounts.browser).sort((a,b)=>b[1]-a[1])[0]?.[0] || null;
    const topOs = Object.entries(deviceCounts.os).sort((a,b)=>b[1]-a[1])[0]?.[0] || null;

    // ip address: pick most recent event ip
    const recentIp = recentEvents[0]?.ipAddress || null;

    return res.json({
      userId,
      totalEvents,
      deviceDetails: { browser: topBrowser, os: topOs },
      ipAddress: recentIp,
      recentEvents
    });
  } catch (err) {
    next(err);
  }
};
