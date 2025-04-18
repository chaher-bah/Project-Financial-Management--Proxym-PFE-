import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './config/keycloak'
import './index.css'
import App from './App.jsx'
import axios from 'axios';


const tokenLogger = (tokens) => {
  console.log('onKeycloakTokens', tokens);
};
const syncUserData = async (token) => {
  try {
    const response = await axios.put('http://localhost:3000/api/user/sync', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Operation successful:', response.data.user);
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};
const handleKeycloakEvent = (event, error) => {
  if (event === 'onAuthSuccess' && keycloak.authenticated) {
    console.log('User authenticated successfully');
    console.log('onKeycloakEvent', event, error);
    syncUserData(keycloak.token);
  }
};


createRoot(document.getElementById('root')).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={handleKeycloakEvent}
    onTokens={tokenLogger}
    initOptions={{
      onLoad: 'login-required',
      checkLoginIframe: false,
      enableLogging: true,
      pkceMethod: 'S256', 
    }}
    >
  <StrictMode>
    <App />
  </StrictMode></ReactKeycloakProvider>,
)
