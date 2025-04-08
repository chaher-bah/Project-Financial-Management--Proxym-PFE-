import React, { useState } from "react";
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

const Parameters = () => {
  // Mock data for parameters
  const [generalSettings, setGeneralSettings] = useState({
    name: "Bahri Chaher",
    email: "contact@proxym.com",
    phoneNumber: "+216 71 123 456",
    groupe: "BEST",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    reportUpdates: true,
    budgetAlerts: false,
    teamChanges: true,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/myAvatar.png");
  const [activeSection, setActiveSection] = useState("info");

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

  const handleGeneralSettingsChange = (e) => {
    setGeneralSettings({
      ...generalSettings,
      [e.target.name]: e.target.value,
    });
    setIsSaved(false);
  };

  const handleSaveSettings = () => {
    // Mock API call to save settings
    console.log("Saving settings:", { generalSettings, notificationSettings });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Paramètres
      </Typography>

      {isSaved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Paramètres enregistrés avec succès!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={10} md={3}>
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
                <DataField label="Nom" value={generalSettings.name} />
                <DataField label="Email" value={generalSettings.email} />
                <DataField
                  label="Numéro de téléphone"
                  value={generalSettings.phoneNumber}
                />
                <DataField label="Groupe" value={generalSettings.groupe} />
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
                    value={generalSettings.name}
                    onChange={handleGeneralSettingsChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={generalSettings.email}
                    onChange={handleGeneralSettingsChange}
                  />
                  <InputField
                    label="Numéro de téléphone"
                    name="phoneNumber"
                    value={generalSettings.phoneNumber}
                    onChange={handleGeneralSettingsChange}
                  />
                  <InputField
                    label="Groupe"
                    name="groupe"
                    value={generalSettings.groupe}
                    onChange={handleGeneralSettingsChange}
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
  );
};

export default Parameters;
