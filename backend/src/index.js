require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const keycloak = require("./config/keycloak");
const { connectToDatabase } = require('../database/mongoose.js');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');

const app = express();

// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

// Connect to MongoDB
connectToDatabase()
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));
// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.KEYCLOAK_CLIENT_SECRET || "ndjA0cXpqRZRfY4H3vnjrt9PPyhvFJbx",
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore(),
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true // Ensures the cookie is not accessible via JavaScript
    },
  })
);

// Initialize Keycloak middleware
app.use(keycloak.middleware());

// Register routes
app.use('/api/users', userRoutes);

// Protected routes example
app.get("/api/protected", keycloak.protect(), (req, res) => {
  res.json({ message: "This is a protected route" });
});

// Role-based protected routes
app.get("/api/admin", keycloak.protect("realm:Admin"), (req, res) => {
  res.json({ message: "Admin route" });
});

app.get("/api/manager", keycloak.protect("realm:Manager"), (req, res) => {
  res.json({ message: "Manager route" });
});

app.get("/api/pmo", keycloak.protect("realm:Pmo"), (req, res) => {
  res.json({ message: "PMO route" });
});

app.get("/api/pm", keycloak.protect("realm:Pm"), (req, res) => {
  res.json({ message: "PM route" });
});

// Public route
app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public route" });
});

// Add MongoDB connection status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});