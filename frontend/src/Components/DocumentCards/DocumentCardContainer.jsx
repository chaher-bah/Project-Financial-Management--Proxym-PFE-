import React, { useState, useEffect } from "react";
import { Grid, Container } from "@mui/material";
import DocumentCard from "./DocumentCard";
import "./DocumentCardContainer.css";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";

const DocumentCardContainer = ({refreshTag}) => {
  const { getMyFiles } = useDocs();
  const { userData } = useGetUserData();

  const [sentDocuments, setSentDocuments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData.id) return;
  
      // 2. Load the uploads for this user
      const uploadsData = await getMyFiles(userData.id);
      console.log("uploadsData:", uploadsData);
      const uploadsCount = uploadsData.count ;
      if (uploadsData?.uploads) {
        const documents = uploadsData.uploads.flatMap(upload => {
          return upload.files.map(file => {
            const recipientNames = upload.recipients.map(
              r => `${r.firstName} ${r.familyName.toUpperCase()} ,`
            );
  
            return {
              fileName: file.originalName,
              recipients: recipientNames,
              creationDate: new Date(upload.createdAt).toLocaleDateString(),
              onOpen: () => console.log(`Opening ${file.originalName}`)
            };
          });
        });
  
        setSentDocuments(documents);
      }
    };
  
    fetchData();
  }, [userData.id, refreshTag]); 


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
            documents={approvedDocuments}
            cardColor="#97371d"
            className="revised"
            expandRoute="/reports/revised"
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
        <Grid item xs={12} md={6}>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default DocumentCardContainer;