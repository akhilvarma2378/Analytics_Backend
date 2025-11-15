// src/middleware/apiKeyAuth.js
const prisma = require('../prisma/client');

module.exports = async function apiKeyAuth(req, res, next) {
  try {
    const apiKey = req.header('x-api-key') || req.header('authorization')?.replace('ApiKey ', '') || req.query.api_key;
    if (!apiKey) return res.status(401).json({ error: 'API key missing' });

    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { app: true }
    });

    if (!key || key.revoked) return res.status(403).json({ error: 'Invalid or revoked API key' });
    if (key.expiresAt && key.expiresAt < new Date()) return res.status(403).json({ error: 'API key expired' });

    // attach app information
    req.appEntity = { id: key.app.id, name: key.app.name, ownerEmail: key.app.ownerEmail };
    req.apiKeyObj = key;
    next();
  } catch (err) {
    next(err);
  }
}
