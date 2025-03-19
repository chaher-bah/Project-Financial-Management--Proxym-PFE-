import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import "./Upload.css";
import DocumentCardContainer from "../DocumentCards/DocumentCardContainer";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [firstDestination, setFirstDestination] = useState("");
  const [secondDestination, setSecondDestination] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Will be replaced with actual API calls later
  const destinations = ["Destination 1", "Destination 2", "Destination 3"];

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Upload logic will be implemented later
    console.log({
      file,
      firstDestination,
      secondDestination,
      dueDate,
    });
  };

  return (<>
    <Paper className="upload-container" elevation={0}>
      <Typography variant="h5" className="upload-title">
        Upload File
      </Typography>

      <Box className="upload-form">
        <Box className="form-field">
          <Typography className="field-label">File</Typography>
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
                />
              ),
              readOnly: true,
              value: file ? file.name : "",
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
              renderValue={firstDestination !== "" ? undefined : () => "Select"}
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
