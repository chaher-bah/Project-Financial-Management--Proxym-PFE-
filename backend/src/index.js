require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const keycloak = require("./config/keycloak");

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: "BlnTh7FYx4SOk2d9KmEKsH8msp6avBlR",
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

// Protected routes example
app.get("/api/protected", keycloak.protect(), (req, res) => {
  res.json({ message: "This is a protected route" });
});

// Role-based protected routes
app.get("/api/admin", keycloak.protect("realm:Admin"), (req, res) => {
  res.json({ message: "Admin route" });
});

app.get("/api/manager", keycloak.protect("realm:Managers"), (req, res) => {
  res.json({ message: "Manager route" });
});

app.get("/api/pmo", keycloak.protect("realm:PMo"), (req, res) => {
  res.json({ message: "PMO route" });
});

app.get("/api/pm", keycloak.protect("realm:ProjectManager"), (req, res) => {
  res.json({ message: "PM route" });
});

// Public route
app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public route" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
