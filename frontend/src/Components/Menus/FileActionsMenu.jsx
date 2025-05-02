import React ,{useState}from 'react'
import { Box, Button, Menu, MenuItem, Typography, ListItemText } from "@mui/material";


const FeedbackMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        size="medium"
        onClick={handleOpen}
      >
        Voir Feedbacks
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Typography variant="subtitle2" sx={{ pl: 2, pt: 1 }}>
          Feedbacks
        </Typography>
        {row.files?.length > 0 ? (
          row.files.flatMap((file) => 
            file.feedback?.length > 0 
              ? file.feedback.map((fb) => (
                  <MenuItem key={fb.feedbackDate} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <ListItemText
                      primary={fb.feedbackText}
                      secondary={
                        <React.Fragment>
                          Ajouté par <strong>{fb.user.firstName} {fb.user.familyName.toUpperCase()}</strong> - {new Date(fb.feedbackDate).toLocaleString()}
                        </React.Fragment>
                      }
                    />
                  </MenuItem>
                ))
              : []
          )
        ) : (
          <MenuItem disabled>Aucun feedback</MenuItem>
        )}
      </Menu>
    </>
  );
};



const FileActionsMenu = ({ row, fetchDocuments, userId, setAlert, downloadFileVersion }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
  
    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
  
    const handleDownloadVersion = (version) => {
      try {
        downloadFileVersion(row.parentId, row.fileName, version.originalName);
        fetchDocuments(userId);
        setAlert({ open: true, type: "success", message: "Version téléchargée avec succès." });
        handleClose();
      } catch (error) {
        console.error("Error downloading file:", error);
        setAlert({ open: true, type: "error", message: "Erreur lors du téléchargement." });
        handleClose();
      }
    };
  
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          size="medium"
          onClick={handleOpen}
        >
          Voir Fichier ajouté par collabs
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <Typography variant="subtitle2" sx={{ pl: 2, pt: 1 }}>
            Fichiers Ajoutés par collabs
          </Typography>
          {row.files?.length > 0 ? (
            row.files.map((file) => (
              file.versions?.length > 0 && (
                file.versions.map((version) => (
                  <MenuItem key={version.fileName} sx={{ flexDirection: "column", alignItems: "flex-start" }}>
                    <ListItemText
                      primary={version.originalName}
                      secondary={
                          <React.Fragment>
                            Ajouté par <strong>{version.uploadedBy.firstName} {version.uploadedBy.familyName.toUpperCase()}</strong> - {new Date(version.uploadDate).toLocaleString()}
                          </React.Fragment>
                        }
                    />
                    <Button
                      size="small"
                      onClick={() => handleDownloadVersion(version)}
                      sx={{ ml: 2 }}
                    >
                      Télécharger
                    </Button>
                  </MenuItem>
                ))
              )
            ))
          ) : (
            <MenuItem disabled>Aucune version</MenuItem>
          )}
        </Menu>
  
        <FeedbackMenu row={row} />
      </Box>
    );
  };


export default FileActionsMenu;