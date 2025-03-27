import React from "react";
import { Grid, Container } from "@mui/material";
import DocumentCard from "./DocumentCard";
import "./DocumentCardContainer.css";

const DocumentCardContainer = () => {
  const toBeRevisedDocuments = [
    {
      fileName: "Team Classification.txt",
      destination1: "Mohammed",
      destination2: "Bilel",
      onOpen: () => console.log("Opening Team Classification.txt"),
    },
    {
      fileName: "Best Team Rapport.xlsx",
      destination1: "Bilel",
      destination2: "Lamia",
      onOpen: () => console.log("Opening Best Team Rapport.xlsx"),
    },
    {
      fileName: "DevOps Tools Subscription",
      destination1: "Lamia",
      destination2: "Bilel",
      onOpen: () => console.log("Opening DevOps Tools Subscription"),
    },
  ];

  const approvedDocuments = [
    {
      fileName: "Team Classification.txt",
      destination1: "Mohammed",
      destination2: "",
      onOpen: () => console.log("Opening Team Classification.txt"),
    },
    {
      fileName: "Best Team Rapport.xlsx",
      destination1: "Bilel",
      destination2: "",
      onOpen: () => console.log("Opening Best Team Rapport.xlsx"),
    },
    {
      fileName: "DevOps Tools Subscription",
      destination1: "Lamia",
      destination2: "",
      onOpen: () => console.log("Opening DevOps Tools Subscription"),
    },
  ];

  return (
    <Container className="document-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Document To Be Revised"
            documents={toBeRevisedDocuments}
            cardColor="#C62300"
            className="to-be-revised"
            expandRoute="/reports/notapproved"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Document Approved"
            documents={approvedDocuments}
            cardColor="#4caf50"
            className="approved"
            expandRoute="/reports/approved"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DocumentCardContainer;
