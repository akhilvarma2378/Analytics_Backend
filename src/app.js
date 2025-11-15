const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;

