import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

const RejectedReports = () => {
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const notApprovedDocuments = [
    {
      fileName: "Team Classification.txt",
      destination1: "Mohammed",
      destination2: "Bilel",
      dueDate: "2023-03-22",
      onOpen: () => console.log("Opening Team Classification.txt"),
    },
    {
      fileName: "Best Team Rapport.xlsx",
      destination1: "Bilel",
      destination2: "Lamia",
      dueDate: "2023-03-20",
      onOpen: () => console.log("Opening Best Team Rapport.xlsx"),
    },
    {
      fileName: "DevOps Tools Subscription",
      destination1: "Lamia",
      destination2: "Bilel",
      dueDate: "2023-03-25",
      onOpen: () => console.log("Opening DevOps Tools Subscription"),
    },
    {
      fileName: "Market Analysis.pptx",
      destination1: "Mohammed",
      destination2: "Lamia",
      dueDate: "2023-03-18",
      onOpen: () => console.log("Opening Market Analysis.pptx"),
    },
    {
      fileName: "Client Presentation.pdf",
      destination1: "Bilel",
      destination2: "Mohammed",
      dueDate: "2023-03-23",
      onOpen: () => console.log("Opening Client Presentation.pdf"),
    },
  ];
  

  return (
    <Container className="reports-container">
      <Box className="reports-header">
        <Typography variant="h4" className="reports-title">
          Documents 
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/reports")}
        >
          Back to Overview
        </Button>
      </Box>

      <Box className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>First Destination</th>
              <th>Second Destination</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notApprovedDocuments.map((doc, index) => (
              <tr key={index}>
                <td>{doc.fileName}</td>
                <td>{doc.destination1}</td>
                <td>{doc.destination2}</td>
                <td>{doc.dueDate}</td>
                <td>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={doc.onOpen}
                  >
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Container>
  );
};

export default RejectedReports;
