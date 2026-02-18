const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/performance_management';
const PORT = process.env.PORT || 5000;

// Attempt to connect to MongoDB but don't crash the server if it fails
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.warn('MongoDB connection warning:', err.message || err));

app.get('/health', (req, res) => {
  const state = mongoose.connection && mongoose.connection.readyState ? mongoose.connection.readyState : 0;
  res.json({ status: 'ok', dbReadyState: state });
});

app.use('/api/employees', employeeRoutes);
app.use('/api/performances', performanceRoutes);
app.use('/api/evaluations', evaluationRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
