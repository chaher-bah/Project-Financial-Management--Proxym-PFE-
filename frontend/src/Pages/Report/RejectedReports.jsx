import React, { useEffect, useState } from "react";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
import { processFileUploads } from "../../utils/processColumns";
import DataTable from "../../Components/DataTable/DataTable";
import { Button, Box,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Alert } from "@mui/material";
import "./Reports.css";

const RejectedReports = () => {
  const { keycloak } = useKeycloak();
  const { userData } = useGetUserData();
  const { fetchDocuments3, otherStatusDocs, changeFileStatus, deleteFile } =
    useDocs();
  useEffect(() => {
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
    }
  }, [userData?.id, keycloak.authenticated]);
  const rejectedUploads = otherStatusDocs["Refuse"] || { count: 0, data: [] };
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const processedUploads = processFileUploads(rejectedUploads.data);
  const [info, setInfo] = useState({ type: "", message: "" });
  const [open, setOpen] = useState(false);
  console.log("rejectedUploads", rejectedUploads);

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
      ).then(() => {
        setInfo({ 
          type: "success", 
          message: `Le document ${selectedFile.fileName} a été placé en attente de révision.` 
        });
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
        fetchDocuments3(userData?.id); // Refresh the data
      }).catch(error => {
        setInfo({ 
          type: "error", 
          message: "Une erreur s'est produite lors de la modification du statut." 
        });
        setOpen(true);
        setTimeout(() => setOpen(false), 3000);
      });
      handleCloseConfirmDialog();
    }
  };

  const Columns = [
    { field: "uploadCode", headerName: "Code", width: 150 },
    // { field: "comnts", headerName: "Commentaires", width: 150 },
    { field: "fileName", headerName: "Nom de Document", width: 200 },
    { field: "from", headerName: "Envoyer Par", width: 150 },
    { field: "uploadDate", headerName: "Date d'Envoi", width: 150 },
    { field: "to", headerName: "Envoyer A", width: 300 },
    { field: "date", headerName: "Date Limite", width: 150 },

    {
      field: "action",
      headerName: "Opérations",
      width: 150,
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={() => handleOpenConfirmDialog(params.row)}

          >
            Réexaminer
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ margin: 1, maxWidth: "97%" }}>
      {open && (
        <Alert severity={info.type} sx={{ mb: 4, fontSize: "1.2rem" }}>
          {info.message}
        </Alert>
      )}
      <DataTable
        columns={Columns}
        rows={processedUploads}
        title="Documents Rejetés"
        backPath="/reports"
        expand={false}
      />

<Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        PaperProps={{
          style: {
            backgroundColor: "#F5EFFF",
            padding: "15px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Confirmation de changement de statut</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir placer ce document en attente de révision ?
            {selectedFile && (
              <Box sx={{ mt: 2, fontWeight: 'bold' }}>
                Document: {selectedFile.fileName}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleConfirmStatusChange} variant="contained" color="success" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RejectedReports;
