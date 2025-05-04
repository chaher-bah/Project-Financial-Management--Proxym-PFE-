import { useEffect, useState } from "react";
import axios from "axios";
import { useKeycloak } from "@react-keycloak/web";
export const useRole = () => {
  const [roleNames, setRoleNames] = useState([]); // Map of roleId -> roleName
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({type:"",message:""});
    const { keycloak } = useKeycloak();

  // Fetch all roles on component mount
  useEffect(() => {
    const fetchAllRoles = async () => {
      if (!keycloak.authenticated || !keycloak.token) return;
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/role/",
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        console.log("operation fetch:",response.data.message);
        const roleN = response.data.roles.map(role => role.name); // Directly map to array of names
        // setInfo({type:"success",message:response.data.message});
        setRoleNames(roleN);
      } catch (err) {
        console.error("Error fetching all roles:", err);
        setInfo({type:"error",message:err.message});
      } finally {
        setLoading(false);
      }
    };

    fetchAllRoles();
  }, [keycloak.token]);

  //Add a new role
  const addRole = async (roleName) => {
    if (!keycloak.authenticated || !keycloak.token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/role/new",
        { name: roleName },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log("operation fetch:",response.data.message);
      setInfo({type:"success",message:response.data.message});
      setRoleNames((prevRoleNames) => [...prevRoleNames, roleName]);
    } catch (err) {
      console.error("Error adding role:", err);
      setInfo({type:"error",message:err.message});
    } finally {
      setLoading(false);
    }
  };
  //add a role to a user
  const addRoleToUser = async (userId, roleName) => {
    if (!keycloak.authenticated || !keycloak.token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/role/user/role",
        { userId, roleName },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log("operation fetch:",response.data.message);
      setInfo({type:"success",message:response.data.message});
    } catch (err) {
      console.error("Error adding role to user:", err);
      setInfo({type:"error",message:err.message});
    } finally {
      setLoading(false);
    }
  };
  //Remove a role from a user
  const removeRoleFromUser = async (userId, roleName) => {
    if (!keycloak.authenticated || !keycloak.token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/role/user/rm/role",
        { userId, roleName },
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log("operation fetch:",response.data.message);
      setInfo({type:"success",message:response.data.message});
    } catch (err) {
      console.error("Error removing role from user:", err);
      setInfo({type:"error",message:err.message});
    } finally {
      setLoading(false);
    }
  };


  //Delete a role by name
  const deleteRole = async (roleName) => {
    if (!keycloak.authenticated || !keycloak.token) return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/role/${roleName}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log("operation fetch:",response);
      setInfo({type:"success",message:response.data.message});
      setRoleNames((prevRoleNames) =>
        prevRoleNames.filter((name) => name !== roleName)
      );
    } catch (err) {
      console.error("Error deleting role:", err);
      setInfo({type:"error",message:err.message});
    } finally {
      setLoading(false);
    }
  };

  return {
    roleNames,
    addRole,
    addRoleToUser,
    removeRoleFromUser,
    loading,
    info,
    setLoading,
    deleteRole
  };
};