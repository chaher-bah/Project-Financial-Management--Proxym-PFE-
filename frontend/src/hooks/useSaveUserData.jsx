import { useKeycloak } from '@react-keycloak/web';
import { useEffect } from 'react';
import axios from 'axios';

function useSaveUserData() {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      const saveUserData = async () => {
        try {
          const token = keycloak.token;
          const response =await axios.post('http://localhost:3000/api/user/create', {}, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('Operation successful:', response.data.message);
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      };
      saveUserData();
    }else{console.log("not authenticated")}
  }, [initialized, keycloak]);
}

export default useSaveUserData;