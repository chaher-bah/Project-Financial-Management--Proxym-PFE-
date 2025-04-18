import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";
import axios from "axios";

export const useGetUserData = () => {
  const { keycloak, initialized } = useKeycloak();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, message: "" });
  const [avatarPreview, setAvatarPreview] = useState("/myAvatar.png");

  const [userData, setUserData] = useState({
    id: null,
    name: "Bahri Chaher",
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
      console.log(keycloak.tokenParsed);
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
        setUserData(prev => ({
          ...prev,
          id: user._id,
          name: user.name,
          email: user.email || userData.email,
          phoneNumber: user.phone || "Not Provided",
          groupe: user.groupe || "Not Assigned",
          role: keycloak.realmAccess.roles || "",
        }));
        setAvatarPreview(user.photo || "/myAvatar.png");
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError({
          open: true,
          message: "Failed to load user data. Please try again later.",
        });
        setLoading(false);
      }
    };
    fetchUserData();
  }, [keycloak.token]);

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


  return {
    userData,
    loading,
    error,
    setError,
    saveUserData,
    updateUser:setUserData,
  };


};
