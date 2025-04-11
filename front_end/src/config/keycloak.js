import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://localhost:8080",
    realm:"Proxym-IT",
    clientId: "pfeFRONT",
    };
const keycloak = new Keycloak(keycloakConfig);
export default keycloak;