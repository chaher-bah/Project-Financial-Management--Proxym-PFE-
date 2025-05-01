import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import Loader from "../../Components/Loader/Loader";
import {
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import DataTable from "../../Components/DataTable/DataTable";
import DataField from "../../Components/Fields/DataField";
import DateDiffIndicator from "../../Components/DateDiffIndicator/DateDiffIndicator";
import ConfirmationDialog from "../../Components/DocumentCards/ConfirmationDialog"; 
import { processFileUploads } from "../../utils/processColumns";

const PendingReports = () => {
  const {
    fetchDocuments3,
    otherStatusDocs,
    loading: docsLoading,
    changeFileStatus,
    saveFileFeedback,
    saveNewFileVersion
  } = useDocs();
  const { keycloak } = useKeycloak();
  const { userData, loading: userLoading } = useGetUserData();
  const [info, setInfo] = useState({ type: "", message: "" });
  const [open, setOpen] = useState(false);
  
  // State for confirmation dialogs
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(""); // "approve" or "reject"
  const [selectedFile, setSelectedFile] = useState(null);

  // State for feedback dialog
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [openModify, setOpenModify] = useState(false);
  const [modifyFileInput, setModifyFileInput] = useState(null);

  // Function to open confirmation dialog for Approve action
  const handleOpenApproveDialog = (file) => {
    setSelectedFile(file);
    setConfirmAction("approve");
    setConfirmDialogOpen(true);
  };

  // Function to open confirmation dialog for Reject action
  const handleOpenRejectDialog = (file) => {
    setSelectedFile(file);
    setConfirmAction("reject");
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedFile(null);
    setConfirmAction("");
  };
  
  const handleOpenFeedback = (fileRow, uploadRow) => {
    console.log("uproadRow", uploadRow);
    setSelectedFile({
      fileName: fileRow.fileName,
      sender: uploadRow.from,
      dueDate: uploadRow.date,
      recipients: uploadRow.to,
      parentId: fileRow.parentId,
    });
    setFeedbackText("");
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
    setModifyFileInput(null);
  };

  // const handleSendFeedback = async() => {
  //   try{
  //     await saveFileFeedback(
  //       selectedFile.parentId,
  //       feedbackText,
  //       userData,
  //       selectedFile.fileName,
  //     );
  //     setInfo({ type: "success", message: "Feedback envoyé avec succès" });
  //     setOpen(true);
  //     await fetchDocuments3(userData.id);
  //     setOpenFeedback(false);

  //   }catch (error) {
  //     setInfo({ type: "error", message: "Erreur lors de l'envoi du feedback" });
  //   }
  //   finally {
  //     setOpen(true);
  //     setTimeout(() => setOpen(false), 3000);
  //     setInfo({ type: "", message: "" });
  //   }
  // };


  const handleSendFeedback = async () => {
    let feedbackSent = false;
    let fileUploaded = false;
    let errors = [];
  
    // Send feedback if text is provided
    console.log("feedbackText", feedbackText,selectedFile.parentId, userData, selectedFile.fileName);
    if (feedbackText.trim() !== '') {
      try {
        await saveFileFeedback(
          selectedFile.parentId,
          selectedFile.fileName,

          feedbackText,
          userData,
        );
        feedbackSent = true;
      } catch (err) {
        errors.push("Erreur lors de l'envoi du feedback");
      }
    }
  
    // Upload new file if selected
    if (modifyFileInput) {
      try {
        await saveNewFileVersion(
          selectedFile.parentId,
          selectedFile.fileName,
          modifyFileInput,
          userData,
        );
        fileUploaded = true;
      } catch (err) {
        errors.push("Erreur lors de l'envoi du fichier");
      }
    }
  
    // Refresh documents
    try {
      await fetchDocuments3(userData.id);
    } catch (err) {
      errors.push("Erreur lors de la mise à jour des documents");
    }
  
    // Build the message based on outcomes
    let message = "";
    if (feedbackSent && fileUploaded) {
      message = "Feedback et fichier envoyés avec succès";
    } else if (feedbackSent) {
      message = "Feedback envoyé avec succès";
    } else if (fileUploaded) {
      message = "Fichier envoyé avec succès";
    }
  
    if (errors.length > 0) {
      if (message) {
        message += ". Mais " + errors.join(" et ");
      } else {
        message = errors.join(" et ");
      }
    }
  
    // Determine alert type: success if no errors, warning if partial success, error if all failed
    const type = errors.length > 0 ? (message.includes("succès") ? "warning" : "error") : "success";
  
    // Set alert and show it
    setInfo({ type, message });
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      setInfo({ type: "", message: "" });
    }, 5000); // Show alert for 5 seconds
    setOpenFeedback(false);
  };
  const handleFileChange = (e) => setModifyFileInput(e.target.files[0]);
  
  const handleSendModify = async() => {
    if (!modifyFileInput) return;
    try{
      await saveNewFileVersion(
        selectedFile.parentId,
        selectedFile.fileName,
        modifyFileInput,
        userData,
      );
      setInfo({ type: "success", message: "Fichier Ajouter avec succès" });
      await fetchDocuments3(userData.id);
      setOpenFeedback(false);
    }catch (error) {
      setInfo({ type: "error", message: "Erreur lors de l'envoi du fichier" });
    }
    finally {
      setOpen(true);
      setTimeout(() => setOpen(false), 3000);
      setInfo({ type: "", message: "" });
    }
  };
  
  
  // Function to handle confirmation of status change
  const handleConfirmStatusChange = () => {
    if (selectedFile) {
      const status = confirmAction === "approve" ? "Approuvee" : "Refuse";
      const fileRow = selectedFile.files?.find(f => f.id === selectedFile.id) || selectedFile;
      
      changeFileStatus(
        fileRow.parentId,
        fileRow.fileName,
        status
      )
        .then(() => {
          setInfo({
            type: confirmAction === "approve" ? "success" : "error",
            message: confirmAction === "approve" 
              ? `Document ${fileRow.fileName} approuvé avec succès` 
              : `Document ${fileRow.fileName} refusé`
          });
          setOpen(true);
          setTimeout(() => setOpen(false), 3000);
          fetchDocuments3(userData?.id); // Refresh the data
        })
        .catch((error) => {
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
    { field: "uploadCode", headerName: "Code", width: 110 },
    { field: "fileName", headerName: "Nom de Document", width: 200 },
    { field: "from", headerName: "Envoyer Par", width: 130 },
    { field: "uploadDate", headerName: "Date d'Envoi", width: 110 },
    { field: "to", headerName: "Envoyer A", width: 250 },
    { field: "downloadedBy", headerName: "Télécharger Par", width: 200 },
    { field: "date", headerName: "Date Limite", width: 110 },
    {
      field: "action",
      headerName: "Operations",
      width: 210,
      renderCell: (params) => {
        const fileRow =
          params.row.files.find((f) => f.id === params.row.id) || params.row;
        const uploadRow = params.row;
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleOpenApproveDialog(params.row)}
            >
              Approuver
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleOpenRejectDialog(params.row)}
            >
              Refuser
            </Button>
            <Button
              variant="contained"
              color="warning"
              size="medium"
              onClick={() => handleOpenFeedback(fileRow, uploadRow)}
            >
              Feedback / Modifier Fichier
            </Button>
          </Box>
        );
      },
    },
  ];

  useEffect(() => {
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
    }
  }, [userData?.id, keycloak.authenticated]);

  const pendingDocs = otherStatusDocs["EnAttente"] || { count: 0, data: [] };
  if (docsLoading || userLoading) {
    return <Loader />;
  }
  const rows = processFileUploads(pendingDocs.data);

  return (
    <div style={{ margin: 1, maxWidth: "98%" }}>
      {open && (
        <Alert severity={info.type} sx={{ mb: 4, fontSize: "1.2rem" }}>
          {info.message}
        </Alert>
      )}

      <DataTable
        columns={Columns}
        rows={rows}
        title="Documents An Attente"
        backPath="/reports"
        expand={false}
      />

      {/* Feedback Dialog */}
      <Dialog
        open={openFeedback}
        onClose={handleCloseFeedback}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: "#F5EFFF",
            padding: "15px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Appliquer des modifications </DialogTitle>
        <DialogContent dividers>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              gap: "20px 270px",
              flexWrap: "wrap",
              alignContent: "center",
            }}
          >
            <DataField value={selectedFile?.fileName} label="Nom de Document" />
            <DataField value={selectedFile?.sender} label="Envoyé Par" />
            <DataField value={<DateDiffIndicator dueDate={selectedFile?.dueDate}/>} label="Date Limite" />
            <DataField value={selectedFile?.recipients} label="Envoyé A" />
          </div>
        </DialogContent>
        <DialogTitle>Envoyer un feedback</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Votre feedback"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogTitle>Modifier le fichier</DialogTitle>

        <DialogContent dividers>
          <Box mt={2}>
            <Button variant="outlined" component="label">
              Choisir un nouveau fichier
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {modifyFileInput && (
              <Typography m={1}>{modifyFileInput.name}</Typography>
            )}
          </Box>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Annuler</Button>
          <Button onClick={handleSendFeedback} disabled={!feedbackText.trim() && !modifyFileInput}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reusable Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        title={confirmAction === "approve" ? "Confirmation d'approbation" : "Confirmation de refus"}
        content={
          confirmAction === "approve"
            ? "Êtes-vous sûr de vouloir approuver ce document ?"
            : "Êtes-vous sûr de vouloir refuser ce document ?"
        }
        confirmButtonText="Confirmer"
        cancelButtonText="Annuler"
        onConfirm={handleConfirmStatusChange}
        confirmButtonColor={confirmAction === "approve" ? "success" : "error"}
        selectedItem={selectedFile?.fileName}
        selectedItemLabel="Document"
      />
    </div>
  );
};

export default PendingReports;