import React, { useState,useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Avatar,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DataField from "../../Components/Fields/DataField";
import InputField from "../../Components/Fields/InputField";
import { useKeycloak } from "@react-keycloak/web"; // Adjust import based on your Keycloak setup
import { useGetUserData } from "../../hooks/useGetUserData";
import Loader from "../../Components/Loader/Loader";
const Parameters = () => {
  const { keycloak } = useKeycloak();
  const [isSaved, setIsSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/myAvatar.png");
  const [activeSection, setActiveSection] = useState("info");
  const {userData,loading,error,setError, saveUserData}=useGetUserData();
  const [form, setForm] = useState({
    firstName: userData.firstName,
    familyName:userData.familyName,
    phoneNumber: userData.phoneNumber || '',
  });
  //update the form data when the genral settings are fetched
  useEffect(() => {
    setForm({
      firstName: userData.firstName,
      familyName:userData.familyName,
      phoneNumber: userData.phoneNumber,
    });
  }, [userData]);
  console.log("userData",userData);
 
  /* test with th image upload TODO chage it */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // const handleSaveSettings = async () => {
  //   // Check if any fields have changed
  //   const hasChanges =
  //     (form.name !== userData.name && form.name !== "") ||
  //     (form.email !== userData.email && form.email !== "") ||
  //     (form.phoneNumber !== userData.phoneNumber &&
  //       form.phoneNumber !== null);
  //   if (!hasChanges) {
  //     console.log("No changes to save");
  //     setError({ open: true, message: "Aucun changement a enregistrer" });

  //     return;
  //   }
  //   try {
  //     setLoading(true);

  //     // Make API call to update user settings
  //     await axios.patch(
  //       `http://localhost:3000/api/user/${userData.id}`,
  //       {
  //         name: form.name,
  //         email: form.email,
  //         phone: form.phoneNumber,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${keycloak.token}`,
  //         },
  //       }
  //     );

  //     setIsSaved(true);
  //     setLoading(false);
  //     setuserData((prev) => ({
  //       ...prev,
  //       name: form.name,
  //       email: form.email,
  //       phoneNumber: form.phoneNumber,
  //     }));
  //   } catch (err) {
  //     console.error("Error saving settings:", err);
  //     setError({
  //       open: true,
  //       message: "Failed to save settings. Please try again.",
  //     });
  //     setLoading(false);
  //   }
  // };

  const handleSaveSettings = async () => {
    // Check for changes
    const hasChanges =
      (form.firstName !== userData.firstName && form.firstName !== "") ||
      (form.familyName !== userData.familyName && form.familyName !== "") ||
      (form.phoneNumber !== userData.phoneNumber && form.phoneNumber !== null);

    if (!hasChanges) {
      console.log("No changes to save");
      setError({ open: true, message: "Aucun changement a enregistrer" });
      return;
    }

    const success = await saveUserData({
      firstName: form.firstName,
      familyName:form.familyName,
      phone: form.phoneNumber,
    });

    if (success) {
      setIsSaved(true);
    }
  };


  return <>
    {loading ? <Loader/> : (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ m: 3 }}>
        Paramètres
      </Typography>

      {isSaved && (
        <Alert severity="success" sx={{ mb: 2,fontSize:'1.2rem',padding:"16px 16px",alignItems:"center" }}>
          Paramètres enregistrés avec succès!
        </Alert>
      )}
      {error.open && (
        <Alert severity="error" sx={{ mb: 2,fontSize:'1.2rem',padding:"16px 16px",alignItems:"center" }} onClose={() => setError({open:false,message:''})}> {error.message}
          </Alert>)}

      <Grid container spacing={3}>
        <Grid item xs={10} md={4}>
          <Card elevation={2} sx={{ p: 2.5 }}>
            <Typography component="div" variant="h5" sx={{ mb: 2.5 }}>
              Information Personnelle
            </Typography>
            <Divider />
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Avatar
                  src={avatarPreview}
                  alt="Default Avatar"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
              <Grid container spacing={2}>
                <DataField label="Nom" value={`${userData.firstName}  ${userData.familyName.toUpperCase()}`} />
                <DataField label="Email" value={userData.email} />
                <DataField
                  label="Numéro de téléphone"
                  value={userData.phoneNumber}
                />
                <DataField label="Groupe(s)" value={userData.groupe} />
                <DataField label="Role(s)" value={userData.role} />

              </Grid>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Button
                  variant={activeSection === "info" ? "contained" : "outlined"}
                  startIcon={<PersonIcon />}
                  onClick={() => setActiveSection("info")}
                >
                  Information Personnelle
                </Button>
                <Button
                  variant={activeSection === "photo" ? "contained" : "outlined"}
                  startIcon={<CameraAltIcon />}
                  onClick={() => setActiveSection("photo")}
                >
                  Modifier Photo
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          {activeSection === "info" ? (
            <Card elevation={2} sx={{ p: 2.5 }}>
              <Typography component="div" variant="h5">
                Information Personnelle
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: "text.secondary" }}
              >
                Modifier Votre Information Personnelle
              </Typography>
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <InputField
                    label="Nom"
                    name="name"
                    placeholder="Nom"
                    onChange={(e) => setForm({ ...form, familyName: e.target.value })}

                  />
                   <InputField
                    label="Prenom"
                    name="firstName"
                    placeholder="Prenom"
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}

                  />
                  
                  <InputField
                    label="Numéro de téléphone"
                    name="phoneNumber"
                    placeholder="Nouveau Numéro de téléphone"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}

                  />
                  
                </Grid>
                <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleSaveSettings}
                  >
                    Enregistrer les paramètres
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    sx={{ ml: 2 }}
                    onClick={() => setIsSaved(false)}
                  >
                    Annuler
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card elevation={2} sx={{ p: 2.5 }}>
              <Typography component="div" variant="h5" sx={{ mb: 2.5 }}>
                Modifier la Photo de Profil
              </Typography>
              <Divider />
              <CardContent>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CameraAltIcon />}
                      >
                        Choisir une nouvelle photo
                      </Button>
                    </label>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => console.log("Save photo logic")}
                  >
                    Enregistrer la photo
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    sx={{ ml: 2 }}
                    onClick={() => setActiveSection("info")}
                  >
                    Annuler
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )}</>;
};

export default Parameters;




  // useEffect(() => {
  //   const fetchUserPhoto = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:3000/api/user/avatar/${keycloak.tokenParsed.email}`, {
  //         headers: {  
  //           Authorization: `Bearer ${keycloak.token}`
  //         }
  //       });
  //       const userPhoto = response.data.image;
  //       setAvatarPreview(userPhoto);
  //     } catch (error) {
  //       console.error("Error fetching user photo:", error);
  //     }
  //   };
  //   fetchUserPhoto();
  // }, [keycloak.token]);