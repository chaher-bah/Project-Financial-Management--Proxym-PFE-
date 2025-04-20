// keycloakService.js
const session = require("express-session");
const Keycloak = require("keycloak-connect");
const { keycloakData } = require("./keycloakconfig");

const memoryStore = new session.MemoryStore();

const keycloakInst = new Keycloak({ store: memoryStore }, keycloakData);

const sessionMiddleware = session({
  secret: process.env.KEYCLOAK_CLIENT_SECRET || "HELLOEVERYONE",
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
});

module.exports = {
  keycloakInst,
  sessionMiddleware,
};
