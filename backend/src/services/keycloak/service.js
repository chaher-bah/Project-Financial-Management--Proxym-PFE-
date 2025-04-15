const axios = require("axios");
const qs = require("querystring");

class KeycloakService {
  constructor(config) {
    this.realm = config.realm ;
    this.baseUrl = config.baseUrl;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.accessToken = null;
    this.tokenExpiry = null;
  }
  //promise to get the access token from keycloak
  // if the token is not expired, it will return the old token
  async getAccessToken() {
    // console.log(this)
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      console.log("old access token ",this.accessToken);
      return this.accessToken;
    }
    try {
      const response = await axios.post(
        `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`,
        qs.stringify({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          username: "paypalbahrichaher@gmail.com",
          password: "admin",
          grant_type: "password",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      this.accessToken = response.data.access_token;
      this.tokenExpiry = response.data.expires_in + Date.now()*10000;
      return this.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error.message);
      throw new Error("Failed to get access token from Keycloak");
    }
  }
  async getUserById(userId) {
    const accessToken = await this.getAccessToken();
    try {
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(`Error getting user by ID:${userId}`, error.message);
      throw new Error("Failed to get user by ID from Keycloak");
    }
  }
  async getAllUsers() {
    const accessToken = await this.getAccessToken();
    try {
      const response = await axios.get(
        `${this.baseUrl}/admin/realms/${this.realm}/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error getting all users:", error.message);
      throw new Error("Failed to get all users from Keycloak");
    }
  }
}
// const keycloakinst=new KeycloakService({
//   realm: "Proxym-IT",
//   baseUrl: "http://localhost:8080",
//   clientId: "pfe",
//   clientSecret: "OcqrzgmEehly1D4ZftgJCPpOOjECkmhb",
// });
// console.log("Keycloak service initialized with config")
// console.log(keycloakinst)
// keycloakinst.getAccessToken();
// keycloakinst.getUserById("325501ca-7b22-4084-8ee7-91e4115e7a30");
module.exports = KeycloakService;
