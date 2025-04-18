import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

const ApprovedReports = () => {
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const approvedDocuments = [
    {
      fileName: "Team Classification.txt",
      destination1: "Mohammed",
      destination2: "",
      date: "2023-03-15",
      onOpen: () => console.log("Opening Team Classification.txt"),
    },
    {
      fileName: "Best Team Rapport.xlsx",
      destination1: "Bilel",
      destination2: "",
      date: "2023-03-14",
      onOpen: () => console.log("Opening Best Team Rapport.xlsx"),
    },
    {
      fileName: "DevOps Tools Subscription",
      destination1: "Lamia",
      destination2: "",
      date: "2023-03-13",
      onOpen: () => console.log("Opening DevOps Tools Subscription"),
    },
    {
      fileName: "Annual Budget.pdf",
      destination1: "Mohammed",
      destination2: "",
      date: "2023-03-12",
      onOpen: () => console.log("Opening Annual Budget.pdf"),
    },
    {
      fileName: "Project Timeline.docx",
      destination1: "Bilel",
      destination2: "",
      date: "2023-03-11",
      onOpen: () => console.log("Opening Project Timeline.docx"),
    },
  ];

  return (
    <Container className="reports-container">
      <Box className="reports-header">
        <Typography variant="h4" className="reports-title">
          Approved Documents
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
              <th>Approval Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedDocuments.map((doc, index) => (
              <tr key={index}>
                <td>{doc.fileName}</td>
                <td>{doc.destination1}</td>
                <td>{doc.destination2 || "-"}</td>
                <td>{doc.date}</td>
                <td>
                  <Button
                    variant="contained"
                    color="success"
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

export default ApprovedReports;
