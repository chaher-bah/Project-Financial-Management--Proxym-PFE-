import React, { useEffect, useState } from "react";
import DataTable from "../../Components/DataTable/DataTable";
import {
  Button,
  Box,
  Alert,
  Menu,
  MenuItem,
  Divider,
  Typography,
  ListItemText,
} from "@mui/material";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
import Loader from "../../Components/Loader/Loader";
import { processFileUploads } from "../../utils/processColumns";
import ConfirmationDialog from "../../Components/DocumentCards/ConfirmationDialog";

const ActionMenu = ({ row, fetchDocuments, userId, setAlert, downloadFileVersion }) => {
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

const FeedbackMenu = ({ row }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="contained"
        color="error"
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

const ConsultedReports = () => {
  const { keycloak } = useKeycloak();
  const { userData, loading: userLoading } = useGetUserData();
  const {
    loading: docsLoading,
    fetchDocuments3,
    otherStatusDocs,
    downloadFileVersion,
    changeFileStatus,
  } = useDocs();

  const [alert, setAlert] = useState({ open: false, type: "", message: "" });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); 
    const handleOpenConfirmDialog = (file) => {
        setSelectedFile(file);
        setConfirmDialogOpen(true);
      };
    
      const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setSelectedFile(null);
      };
      
      const handleConfirmStatusChange = () => {
        if (selectedFile) {
          changeFileStatus(
            selectedFile.parentId,
            selectedFile.fileName,
            "EnAttente"
          )
            .then(() => {
              setAlert({
                open: true,
                type: "success",
                message: `Le document ${selectedFile.fileName} a été placé en attente de révision.`,
              });
              setTimeout(() => setOpen(false), 3000);
              fetchDocuments3(userData?.id); // Refresh the data
            })
            .catch((error) => {
              setAlert({
                open: true,
                type: "error",
                message:
                  "Une erreur s'est produite lors de la modification du statut.",
              });
              setTimeout(() => setOpen(false), 3000);
            });
          handleCloseConfirmDialog();
        }
      };
  useEffect(() => {
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
    }
  }, [userData?.id, keycloak.authenticated]);

  const consultedDocs = otherStatusDocs["Consultee"] || { count: 0, data: [] };
  const rows = processFileUploads(consultedDocs.data);

  const Columns = [
    { field: "fileName", headerName: "Nom de Document", width: 230 },
    { field: "from", headerName: "Envoyé Par", width: 150 },
    { field: "to", headerName: "Envoyé À", width: 250 },
    { field: "date", headerName: "Date Limite", width: 190 },
    {
      field: "actions",
      headerName: "Actions",
      width: 290,
      renderCell: (params) => (          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      
        <ActionMenu
          row={params.row}
          fetchDocuments={fetchDocuments3}
          userId={userData.id}
          setAlert={setAlert}
          downloadFileVersion={downloadFileVersion}
        />
        <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    onClick={() => handleOpenConfirmDialog(params.row)}
                  >
                    Réexaminer
                  </Button></Box>
      ),
    },
  ];

  if (userLoading || docsLoading) return <Loader />;

  return (
    <div style={{ margin: 1, maxWidth: "98%" }}>
      {alert.open && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{mb: 4, fontSize: "1.2rem" }}
        >
          {alert.message}
        </Alert>
      )}
      <DataTable
        columns={Columns}
        rows={rows}
        title="Documents Consultés"
        backPath="/reports"
        expand={false}
      />
      
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        title="Confirmation de changement de statut"
        content="Êtes-vous sûr de vouloir placer ce document en attente de révision ?"
        onConfirm={handleConfirmStatusChange}
        selectedItem={selectedFile?.fileName}
        selectedItemLabel="Document"
      />
    </div>
  );
};

export default ConsultedReports;