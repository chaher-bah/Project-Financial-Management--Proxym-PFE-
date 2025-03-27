import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import "./Upload.css";
import DocumentCardContainer from "../DocumentCards/DocumentCardContainer";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [firstDestination, setFirstDestination] = useState("");
  const [secondDestination, setSecondDestination] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Will be replaced with actual API calls later
  const destinations = ["Destination 1", "Destination 2", "Destination 3"];

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = () => {
    // Upload logic will be implemented later
    console.log({
      files,
      firstDestination,
      secondDestination,
      dueDate,
    });
  };

  return (
    <>
      <Paper className="upload-container" elevation={0}>
        <Typography variant="h5" className="upload-title">
          Upload Files
        </Typography>

        <Box className="upload-form">
          <Box className="form-field">
            <Typography className="field-label">Files</Typography>
            <TextField
              placeholder="Placeholder"
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
            <Typography className="field-label">1st Destination</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={firstDestination}
                onChange={(e) => setFirstDestination(e.target.value)}
                displayEmpty
                renderValue={
                  firstDestination !== "" ? undefined : () => "Select"
                }
              >
                {destinations.map((destination) => (
                  <MenuItem key={destination} value={destination}>
                    {destination}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="form-field">
            <Typography className="field-label">2nd Destination</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={secondDestination}
                onChange={(e) => setSecondDestination(e.target.value)}
                displayEmpty
                renderValue={
                  secondDestination !== "" ? undefined : () => "Select"
                }
              >
                {destinations.map((destination) => (
                  <MenuItem key={destination} value={destination}>
                    {destination}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box className="form-field">
            <Typography className="field-label">Due Date</Typography>
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
            Upload
          </Button>
        </Box>
      </Paper>
      <DocumentCardContainer />
    </>
  );
};

export default Upload;
