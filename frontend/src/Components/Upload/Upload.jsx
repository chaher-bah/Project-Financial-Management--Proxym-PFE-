import { useState } from "react";
import {
  Box,
  TextField,
  InputLabel,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
  Chip,
  Alert,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./Upload.css";
import DocumentCardContainer from "../DocumentCards/DocumentCardContainer";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useDocs } from "../../hooks/useDocs";
import { useEffect } from "react";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedNames, theme) {
  return {
    fontWeight:
      selectedNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Upload = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({ message: "", type: "success" });
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [refreshUploads, setRefreshUploads] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState("");
  const { getAllUsers, userData } = useGetUserData();
  const [users, setUsers] = useState([]);
  const { uploadFiles, loading } = useDocs();
  const UPLOADERID = userData.id;
  // Fetch all users name
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      if (response.users) {
        setUsers(response.users);
      }
    };
    fetchUsers();
  }, []);

  // Helper function to get user names from IDs
  const getUserNames = (ids) => {
    return ids.map((id) => {
      const user = users.find((u) => u._id === id);
      return user ? user.firstName + user.familyName.toUpperCase() : "";
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCollaboratorsChange = (event) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value.
    setSelectedCollaborators(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleUpload = async () => {
    //user is loaded
    if (!UPLOADERID) {
      setInfo({ message: "Données Utilisateur erronée", type: "error" });
      return;
    }
    //validate inputs
    if (files.length === 0 || selectedCollaborators.length === 0 || !dueDate) {
      setInfo({ message: "Veuillez remplir tous les champs", type: "warning" });
      return;
    }
    //validate date
    const today = new Date();
    const selectedDate = new Date(dueDate);
    if (selectedDate < today) {
      setInfo({
        message: "La date limite ne peut pas être dans le passé",
        type: "warning",
      });
      return;
    }
    //upload files
    try {
      const success = await uploadFiles(
        files,
        selectedCollaborators,
        dueDate,
        UPLOADERID,
        comments
      );
      //reset form
      setFiles([]);
      setSelectedCollaborators([]);
      setDueDate("");

      setInfo({ message: "Fichiers importés avec succès", type: "success" });
      setRefreshUploads((prev) => prev + 1);
    } catch (error) {
      console.error("Error uploading files:", error);
      setInfo({
        message: "Erreur lors de l'importation des fichiers",
        type: "error",
      });
    }
  };

  return (
    <>
      {info.message && (
        <Alert
          severity={info.type}
          onClose={() => setInfo({ message: "", type: "success" })}
          sx={{
            mb: 4,
            fontSize: "1.2rem",
            padding: "16px 16px",
            alignItems: "center",
          }}
        >
          {info.message}
        </Alert>
      )}
      <Paper className="upload-container" elevation={0}>
        <Typography variant="h5" className="upload-title">
          Importer les fichiers
        </Typography>

        <Box className="upload-form">
          <Box className="form-field">
            <InputLabel className="field-label" required>Fichiers</InputLabel>
            <TextField
              placeholder="Choisir des fichiers"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <input
                    type="file"
                    id="file-upload"
                    className="file-input"
                    onChange={handleFileChange}
                    multiple
                  />
                ),
                readOnly: true,
                value: files.map((file) => file.name).join(", "),
              }}
            />
          </Box>

          <Box className="form-field">
            <InputLabel className="field-label" required>Collaborateurs</InputLabel>
            <FormControl fullWidth size="small" required>
              <Select
                multiple
                placeholder="Sélectionner des collaborateurs"
                value={selectedCollaborators}
                onChange={handleCollaboratorsChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {getUserNames(selected).map((name) => (
                      <Chip key={name} label={name} size="small" />
                    ))}
                  </Box>
                )}
                displayEmpty
                MenuProps={MenuProps}
              >
                {users
                  .filter(user => user._id !== UPLOADERID)
                  .map((user) => (
                    <MenuItem
                      key={user._id}
                      value={user._id}
                      style={getStyles(user._id, selectedCollaborators, theme)}
                    >
                      {user.firstName} {user.familyName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="form-field">
            <InputLabel className="field-label"required >Date limite</InputLabel>
            <TextField
              type="date"
              variant="outlined"
              size="small"
              fullWidth
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box className="form-field">
            <Typography className="field-label">Commentaires</Typography>
            <TextField
              type="text"
              placeholder="Ajouter des commentaires"
              variant="outlined"
              size="small"
              fullWidth
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Box>

          <Button
            variant="contained"
            className="upload-button"
            onClick={handleUpload}
            disabled={loading || !UPLOADERID}
          >
            Importer
          </Button>
        </Box>
      </Paper>
      <DocumentCardContainer refreshTag={refreshUploads}/>
    </>
  );
};

export default Upload;
