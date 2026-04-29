const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { initializeGemini } = require('./services/chatService');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Gemini AI
initializeGemini();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/discover', require('./routes/discoverRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.send('Learnova API is running...');
});

// Error fallback middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
