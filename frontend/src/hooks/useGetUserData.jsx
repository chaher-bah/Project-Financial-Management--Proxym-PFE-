import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState ,useCallback} from "react";
import axios from "axios";
export const useGetUserData = () => {
  const { keycloak, initialized } = useKeycloak();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, message: "" });
  const [avatarPreview, setAvatarPreview] = useState("/myAvatar.png");
  const ROLE_HIERARCHY = ["Admin","Pmo","Pm","Manager","new"];

  const [userData, setUserData] = useState({
    id: null,
    familyName: "Bahri",
    firstName: "chaher",
    email: "contact@proxym.com",
    phoneNumber: "+216 71 123 456",
    groupe: "BEST",
    role: ["Pm"],
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
        const filteredRoles = (user.role || [])
          .map(role => role.name)
          // .filter(name => ROLE_HIERARCHY.includes(name));

        const rolesNames = filteredRoles; // Keeping this for backward compatibility
        setUserData((prev) => ({
          ...prev,
          id: user._id,
          familyName: user.familyName || prev.familyName,
          firstName: user.firstName || prev.firstName,
          email: user.email || prev.email,
          phoneNumber: user.phone || prev.phoneNumber,
          groupe: user.groupe || "Not Assigned",
          role: rolesNames.length > 0 ? filteredRoles : ["Not Assigned"],
          photo: user.photo || prev.photo,
        }));
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
  const getAllUsers = useCallback(async () => {
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
  },[keycloak.token]);
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
  //Get PMO users
  const getUsersByRole = async (role) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/user/role/${role}`,
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
    getUsersByRole,
  };


};
