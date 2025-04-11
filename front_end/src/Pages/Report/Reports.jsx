import React, { useState } from "react";
import "./Reports.css";
import { Typography } from "@mui/material";
import Upload from "../../Components/Upload/Upload";
const Reports = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Handle file upload logic here
    console.log("File uploaded:", selectedFile);
  };

  return <div class="card">
    <Typography variant="h4" component="h1" gutterBottom sx={{m:2.5}}>
        Validation de Documents
      </Typography>
    <Upload/>
  </div>;
};

export default Reports;
