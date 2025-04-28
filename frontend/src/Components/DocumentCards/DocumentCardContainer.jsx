import React, { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import DocumentCard from "./DocumentCard";
import "./DocumentCardContainer.css";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useDocsV2 } from "../../hooks/useDocsV2";
import DocCard from "./DocCard";
const DocumentCardContainer = ({refreshTag}) => {
  const { fetchDocuments3,sentDocuments2,otherStatusDocs } = useDocs();
  const { userData } = useGetUserData();
  const {sentDocumentss,fetchAllStatusDocuments,aReviserDocuments,approuveeDocuments,enAttenteDocuments
,consulteeDocuments,refuseDocuments,loading} = useDocsV2();


  useEffect(() => {
    if (!userData.id) return;

    fetchDocuments3(userData.id);
  },[userData.id, refreshTag]); 

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
  console.log("sentDocuments",sentDocuments2);
  console.log("other things ",otherStatusDocs);
  const toReviewDocs   = otherStatusDocs["AReviser"]  || { count: 0, data: [] };
  console.log("toReviewDocs",toReviewDocs);
  const pendingDocs    = otherStatusDocs["EnAttente"] || { count: 0, data: [] };console.log("pendingDocs",pendingDocs);
  const consultedDocs  = otherStatusDocs["Consultee"] || { count: 0, data: [] };console.log("consultedDocs",consultedDocs);
  const approvedDocs   = otherStatusDocs["Approuvee"] || { count: 0, data: [] };
  const rejectedDocs   = otherStatusDocs["Refuse"]    || { count: 0, data: [] };
  return (
    <Container className="document-container">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DocCard
            title="Documents a réviser"
            documents={toReviewDocs}
            cardColor="#97371d"
            className="to-review"
            expandRoute="/reports/to-review"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocCard
            title="Documents envoyés"
            documents={sentDocuments2}
            cardColor="#302d97"
            className="sent"
            expandRoute="/reports/sent"
          />
        </Grid>
        
        
         <Grid item xs={12} md={6}>
          <DocCard
            title="Documents en attente"
            documents={pendingDocs}
            cardColor="#d7a42a"
            className="pending"
            expandRoute="/reports/pending"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocCard
            title="Documents consultés"
            documents={consultedDocs}
            cardColor="#b2d72a"
            className="consulted"
            expandRoute="/reports/consulted"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DocCard
            title="Documents approuvés"
            documents={approvedDocs}
            cardColor="#4caf50"
            className="approved"
            expandRoute="/reports/approved"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <DocCard
            title="Document rejetés"
            documents={rejectedDocs}
            cardColor="#C62300"
            className="rejected"
            expandRoute="/reports/rejected"
          />
        </Grid> 
      </Grid>
    </Container>
  );
};

export default DocumentCardContainer;