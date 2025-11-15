const prisma = require('../prisma/client');
const crypto = require('crypto');

// Generate a secure 64-character API key
function generateApiKey() {
  return crypto.randomBytes(32).toString('hex');
}

exports.register = async (req, res, next) => {
  try {
    const { name, ownerEmail, expiresAt } = req.body;

    if (!name || !ownerEmail) {
      return res.status(400).json({ error: "name and ownerEmail are required" });
    }

    const app = await prisma.app.create({
      data: {
        name,
        ownerEmail
      }
    });

    // Create API Key for the app
    const apiKey = await prisma.apiKey.create({
      data: {
        key: generateApiKey(),
        appId: app.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return res.status(201).json({
      message: "App registered successfully",
      appId: app.id,
      apiKey: apiKey.key,
      expiresAt: apiKey.expiresAt
    });

  } catch (error) {
    next(error);
  }
};


exports.getApiKey = async (req, res, next) => {
  try {
    const { appId } = req.query;

    if (!appId) {
      return res.status(400).json({ error: "appId is required" });
    }

    const keys = await prisma.apiKey.findMany({
      where: { appId, revoked: false }
    });

    return res.status(200).json({ keys });
  } catch (error) {
    next(error);
  }
};


exports.revokeKey = async (req, res, next) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }

    await prisma.apiKey.updateMany({
      where: { key },
      data: { revoked: true }
    });

    return res.status(200).json({ message: "API key revoked successfully" });
  } catch (error) {
    next(error);
  }
};


exports.regenerateKey = async (req, res, next) => {
  try {
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: "key is required" });
    }

    const oldKey = await prisma.apiKey.findUnique({
      where: { key }
    });

    if (!oldKey) {
      return res.status(404).json({ error: "API key not found" });
    }

    //revoking old key first
    await prisma.apiKey.update({
      where: { key },
      data: { revoked: true }
    });

    // Create new key
    const newKey = await prisma.apiKey.create({
      data: {
        key: generateApiKey(),
        appId: oldKey.appId
      }
    });

    return res.status(200).json({
      message: "API key regenerated successfully",
      newKey: newKey.key
    });

  } catch (error) {
    next(error);
  }
};
