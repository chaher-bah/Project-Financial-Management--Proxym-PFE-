import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import axios from "axios";

export const useGetUserData = () => {
  const { keycloak, initialized } = useKeycloak();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, message: "" });
  const [avatarPreview, setAvatarPreview] = useState("/myAvatar.png");
  const ROLE_HIERARCHY = ["Admin","Pmo","Pm","Manager"];

  const [userData, setUserData] = useState({
    id: null,
    familyName: "Bahri",
    firstName: "chaher",
    email: "contact@proxym.com",
    phoneNumber: "+216 71 123 456",
    groupe: "BEST",
    role: "Admin",
    photo: avatarPreview,
  });

  //fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!initialized || !keycloak.authenticated) return;
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/user/email/${keycloak.tokenParsed.email}`,
          {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          }
        );
        const user = response.data.user;
        console.log("operation fetch:",response.data.message);
        const rawRoles = Array.isArray(keycloak.realmAccess?.roles)
        ? keycloak.realmAccess.roles
        : [];
      const filteredRoles = rawRoles.filter(r => ROLE_HIERARCHY.includes(r));
      const completeUserData = {
        id: user._id,
        familyName: user.familyName || userData.familyName,
        firstName: user.firstName || userData.firstName,
        email: user.email || userData.email,
        phoneNumber: user.phone || userData.phoneNumber,
        groupe: user.groupe || "Not Assigned",
        role: filteredRoles.length ? filteredRoles : ["Not Assigned"],
        photo: user.photo || "/myAvatar.png"
      };
        setUserData(completeUserData);
        setAvatarPreview(user.photo || "/myAvatar.png");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError({
          open: true,
          message: "Failed to load user data. Please try again later.",
        });
      }finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [initialized, keycloak.authenticated,keycloak.token]);

  //update user data
  const saveUserData = async (updatedData) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `http://localhost:3000/api/user/${userData.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log(response.data);
      const updatedUser = response.data.user;

      setUserData((prev) => ({ ...prev, ...updatedUser }));
      setError({ open: false, message: "" });
      return true; // Indicate success
    } catch (err) {
      console.error("Error saving settings:", err);
      setError({
        open: true,
        message: "Failed to save settings. Please try again.",
      });
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  //Get all users
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/user`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log("operation fetch:",response.data.message);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError({
        open: true,
        message: "Failed to load user data. Please try again later.",
      });
    }
  };
  //Get user by id
  const getUserById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        }
      );
      console.log("operation fetch:",response.data.message);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError({
        open: true,
        message: "Failed to load user data. Please try again later.",
      });
    }
  };


  return {
    userData,
    loading,
    error,
    setError,
    saveUserData,
    updateUser:setUserData,
    getAllUsers,
    getUserById,
  };


};
