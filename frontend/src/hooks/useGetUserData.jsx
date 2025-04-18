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
  useEffect(() => {
    const fetchUserData = async () => {
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

  return {
    userData,
    loading,
    error,
    
    updateUser:setUserData,
  };


};
