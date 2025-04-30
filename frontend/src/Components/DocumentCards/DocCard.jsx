import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Box,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetUserData } from "../../hooks/useGetUserData";
import "./DocumentCard.css";
import DateDiffIndicator from "../DateDiffIndicator/DateDiffIndicator";

const DocCard = ({ title, documents, cardColor, expandRoute, className }) => {
  const { userData } = useGetUserData();
  const scrollStyles =
    documents.count > 5
      ? {
          maxHeight: "250px",
          overflowY: "auto",
        }
      : {};
  const [expandedUpload, setExpandedUpload] = useState(null);
  const navigate = useNavigate();
  const handleExpand = () => {
    navigate(expandRoute);
  };
  return (
    <Card
      className={`document-card ${className || ""}`}
      style={{ backgroundColor: cardColor }}
    >
      <CardHeader
        title={
          <Typography variant="h6" className="document-card-title">
            {title}
          </Typography>
        }
        action={
          <Box className="card-header-actions">
            <Badge
              badgeContent={documents.count}
              color="secondary"
              className="document-count"
            ></Badge>
            <Button
              variant="contained"
              size="small"
              className="expand-button"
              onClick={handleExpand}
            >
              Grandir
            </Button>
          </Box>
        }
        className="document-card-header"
      />
      <CardContent className="document-card-content" sx={scrollStyles}>
        {documents.data.map((upload) => (
          <Accordion
            key={upload.id}
            expanded={expandedUpload === upload.id}
            onChange={() =>
              setExpandedUpload(expandedUpload === upload.id ? null : upload.id)
            }
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid
                container
                className="document-row"
                alignItems="center"
                width={"100%"}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: upload.color,
                      borderRadius: 4,
                    }}
                  />
                  <Grid item xs={4} ><Typography variant="subtitle2">{upload.code}</Typography></Grid>
                  <Grid item xs={3} ><Chip label={upload.status} size="small" color={upload.status === "Approuvee" ? "success" : upload.status === "EnAttente" ? "warning" : upload.status === "Refuse" ? "error" : "default"} /></Grid>
                  <Grid item xs={7} ><Typography variant="body2">
                    {upload.recipients && userData.id === upload.sender._id
                      ? `A: ${upload.recipients.join(", ")}`
                      : `De: ${
                          upload.sender.firstName
                        } ${upload.sender.familyName}`}
                  </Typography></Grid>
                  <Grid item xs={2} >
                    {upload.dueDate ? (
                      <DateDiffIndicator dueDate={upload.dueDate} />
                    ) : <Typography variant="body2">{doc.creationDate}</Typography>}
                  </Grid>
                </div>
              </Grid>
            </AccordionSummary>

            <AccordionDetails>
              {upload.files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Typography>{file.name}</Typography>
                  <Chip
                    label={file.status}
                    size="small"
                    color={file.status === "Approuvee" ? "success" : file.status === "EnAttente" ? "warning" : file.status === "Refuse" ? "error" : "default"}
                  />
                  <Typography variant="caption">Envoyé le: {file.uploadDate}</Typography>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};
export default DocCard;
