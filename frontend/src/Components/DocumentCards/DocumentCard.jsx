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
              badgeContent={documents.length}
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
              Expand
            </Button>
          </Box>
        }
        className="document-card-header"
      />
      <CardContent className="document-card-content">
        {documents.map((doc, index) => (
          <Grid
            container
            key={index}
            className="document-row"
            alignItems="center"
          >
            <Grid item xs={4} className="document-name">
              <Typography variant="body1">{doc.fileName}</Typography>
            </Grid>
            <Grid item xs={3} className="document-destination">
              <Typography variant="body2">{doc.destination1}</Typography>
            </Grid>
            <Grid item xs={3} className="document-destination">
              <Typography variant="body2">{doc.destination2}</Typography>
            </Grid>
            <Grid item xs={2} className="document-action">
              <Button
                variant="contained"
                color="primary"
                className="open-button"
                onClick={doc.onOpen}
                style={{ backgroundColor: cardColor }}
              >
                Open
              </Button>
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
