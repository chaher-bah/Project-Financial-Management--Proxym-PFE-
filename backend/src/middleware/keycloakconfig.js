require('dotenv').config({ path: '../../../.env' });

const express = require("express");


const keycloakData= {
    realm: process.env.KEYCLOAK_REALM || "Proxym-IT",
   'auth-server-url': process.env.KEYCLOAK_URL || "http://localhost:8080",
    'ssl-required': "external",
    resource: process.env.KEYCLOAK_CLIENT_ID || "pfeFRONT",
    'confidential-port': 0,
    'public-client': true,
};



module.exports = {keycloakData};