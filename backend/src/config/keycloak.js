const session = require("express-session");
const Keycloak = require("keycloak-connect");

// Determine the correct Keycloak URL based on the environment
const getKeycloakUrl = () => {
  // If we're running in Docker, use the internal URL
  if (process.env.NODE_ENV === "development" && process.env.DOCKER_CONTAINER) {
    return process.env.KEYCLOAK_URL || "http://keycloak:8080";
  }
  // For browser access, use localhost
  return "http://localhost:6060";
};

const keycloakConfig = {
  realm: process.env.KEYCLOAK_REALM || "Proxym-IT",
  "auth-server-url": getKeycloakUrl(),
  "ssl-required": "external",
  resource: process.env.KEYCLOAK_CLIENT_ID || "pfe",
  "public-client": true,
  "confidential-port": 0,
  "redirect-uri": "http://localhost:3000/*",
};

// If a client secret is provided, use it (for confidential clients)
if (process.env.KEYCLOAK_CLIENT_SECRET) {
  keycloakConfig["public-client"] = false;
  keycloakConfig.credentials = {
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
  };
}

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

module.exports = keycloak;
