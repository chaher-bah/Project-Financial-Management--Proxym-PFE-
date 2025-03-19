import React, { useState } from "react";
import "./Reports.css";
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
    <Upload/>
  </div>;
};

export default Reports;
