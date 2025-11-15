const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

//Global Catch
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: err.message });
});

module.exports = app;
