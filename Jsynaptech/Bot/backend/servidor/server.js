const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow frontend
  credentials: true
}));

// Body parser
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API corriendo sin problemas' });
});

// Routes for auth
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;