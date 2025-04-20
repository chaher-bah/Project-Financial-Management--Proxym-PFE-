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
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./Upload.css";
import DocumentCardContainer from "../DocumentCards/DocumentCardContainer";

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
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [secondDestination, setSecondDestination] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Will be replaced with actual API calls later
  const collaborators = ["John Smith", "Maria Garcia", "Ahmed Khan", "Sarah Lee", "Carlos Rodriguez"];

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
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleUpload = () => {
    // Upload logic will be implemented later
    console.log({
      files,
      collaborators: selectedCollaborators,
      secondDestination,
      dueDate,
    });
  };

  return (
    <>
      <Paper className="upload-container" elevation={0}>
        <Typography variant="h5" className="upload-title">
          Importer les fichiers
        </Typography>

        <Box className="upload-form">
          <Box className="form-field">
            <Typography className="field-label">Fichiers</Typography>
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
            <InputLabel className="field-label">Collaborateurs</InputLabel>
            <FormControl fullWidth size="small">
              <Select
                multiple
                placeholder="Sélectionner des collaborateurs"
                value={selectedCollaborators}
                onChange={handleCollaboratorsChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
                displayEmpty
                MenuProps={MenuProps}
              >
                {collaborators.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, selectedCollaborators, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="form-field">
            <Typography className="field-label">Date limite</Typography>
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

          <Button
            variant="contained"
            className="upload-button"
            onClick={handleUpload}
          >
            Importer
          </Button>
        </Box>
      </Paper>
      <DocumentCardContainer />
    </>
  );
};

export default Upload;
