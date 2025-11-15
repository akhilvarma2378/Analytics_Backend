const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);

const createRateLimiter = (opts = {}) => rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }),
  windowMs: opts.windowMs || 60 * 1000,
  max: opts.max || 600, 
  keyGenerator: (req) => req.header('x-api-key') || req.ip,
  handler: (req, res) => res.status(429).json({ error: 'Too many requests' })
});

module.exports = createRateLimiter;
