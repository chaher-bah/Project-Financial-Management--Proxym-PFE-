import React, { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import DocumentCard from "./DocumentCard";
import "./DocumentCardContainer.css";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";

const DocumentCardContainer = ({refreshTag}) => {
  const { fetchDocuments,sentDocuments,recievedDocuments } = useDocs();
  const { userData } = useGetUserData();


  useEffect(() => {
    if (!userData.id) return;
    fetchDocuments(userData.id);
  },[userData.id, refreshTag]); 
  

  // Hardcoded data for other categories (unchanged for now)
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
            title="Documents a réviser"
            documents={recievedDocuments}
            cardColor="#97371d"
            className="to-review"
            expandRoute="/reports/to-review"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Documents envoyés"
            documents={sentDocuments}
            cardColor="#302d97"
            className="sent"
            expandRoute="/reports/sent"
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <DocumentCard
            title="Documents en attente"
            documents={approvedDocuments}
            cardColor="#d7a42a"
            className="pending"
            expandRoute="/reports/pending"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Documents consultés"
            documents={approvedDocuments}
            cardColor="#b2d72a"
            className="consulted"
            expandRoute="/reports/consulted"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Documents approuvés"
            documents={approvedDocuments}
            cardColor="#4caf50"
            className="approved"
            expandRoute="/reports/approved"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <DocumentCard
            title="Document rejetés"
            documents={approvedDocuments}
            cardColor="#C62300"
            className="rejected"
            expandRoute="/reports/rejected"
          />
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default DocumentCardContainer;