import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Box,
  Grid,
  Badge,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./DocumentCard.css";

const DocumentCard = ({
  title,
  documents,
  cardColor,
  expandRoute,
  className,
}) => {
  const navigate = useNavigate();

  const handleExpand = () => {
    navigate(expandRoute);
  };
  const scrollStyles =
    documents.count > 5
      ? {
          maxHeight:  "250px",
          overflowY: "auto",
        }
      : {};
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
            >
            </Badge>
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
        {documents.data.map((doc, index) => (
          <Grid
            container
            key={index}
            className="document-row"
            alignItems="center"
          >
            <Grid item xs={6} className="document-name">
              <Typography variant="body1">{doc.fileName}</Typography>
            </Grid>
            <Grid item xs={4} className="document-destination">
              <Typography variant="body2">{doc.recipients||doc.sender}</Typography>
            </Grid>
            
            <Grid item xs={1} className="document-action">
                <Typography variant="body2">{doc.creationDate||doc.dueDate}</Typography>
            </Grid>
          </Grid>
        ))}
      </CardContent>
    </Card>
  );
};

DocumentCard.propTypes = {
  title: PropTypes.string.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      destination1: PropTypes.string.isRequired,
      destination2: PropTypes.string.isRequired,
      onOpen: PropTypes.func.isRequired,
    })
  ).isRequired,
  cardColor: PropTypes.string,
  expandRoute: PropTypes.string.isRequired,
  className: PropTypes.string,
};

DocumentCard.defaultProps = {
  cardColor: "#f5f5f5",
};

export default DocumentCard;
