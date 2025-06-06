require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { connectToDatabase } = require("../database/mongoose.js");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const roleRoutes = require("./routes/roleRoute");
const clickUpRoutes = require("./routes/clickUpRoute");
const groupRoutes = require("./routes/groupRoutes");
const mongoose = require("mongoose");
const { keycloakInst, sessionMiddleware } = require("./middleware/service.js");
const Keycloak = require("keycloak-connect");
const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:8080",
];

// Connect to MongoDB
connectToDatabase()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(sessionMiddleware);
app.use(keycloakInst.middleware());


// Public API

app.get("/api/public", (req, res) => {
  res.json({ message: "This is a public route" });
});

//user api

app.use("/api/user", keycloakInst.protect(), userRoutes);

// Admin api

app.use("/api/admin", keycloakInst.protect("realm:Admin"), adminRoutes);

// Upload API
app.use("/api/upload", keycloakInst.protect(), uploadRoutes);

// Role API
app.use("/api/role", keycloakInst.protect(), roleRoutes);

//ClickUp API
app.use("/api/clickup", keycloakInst.protect(), clickUpRoutes);

//Group API
app.use("/api/group", keycloakInst.protect(), groupRoutes);


// Add MongoDB connection status endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




// const memoryStore = new session.MemoryStore();
// app.use(session({
//   secret: process.env.KEYCLOAK_CLIENT_SECRET || "HELLOEVERYONE",
//   resave: false,
//   saveUninitialized: true,
//   store: memoryStore,
//   }));
// const keycloakInst = new Keycloak({
//   store: memoryStore,
// }, keycloakData);

// app.use(keycloakInst.middleware());