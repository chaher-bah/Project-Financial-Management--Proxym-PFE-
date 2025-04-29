import React, { useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import Loader from "../../Components/Loader/Loader";
import {
  Button,
  Box,
  Snackbar,
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
const PendingReports = () => {
  const {
    fetchDocuments3,
    otherStatusDocs,
    loading: docsLoading,
    changeFileStatus,
    downloadFile,
  } = useDocs();
  const { keycloak } = useKeycloak();
  const { userData, loading: userLoading } = useGetUserData();
  const [info, setInfo] = useState({ type: "", message: "" });
  const [open, setOpen] = useState(false);

  // New state for feedback dialog
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedFile, setSelectedFile] = useState({});
  const [openModify, setOpenModify] = useState(false);
  const [modifyComments, setModifyComments] = useState("");
  const [modifyFileInput, setModifyFileInput] = useState(null);

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
  };

  const handleSendFeedback = () => {
    // Implement actual feedback submission logic here, e.g. API call
    console.log("Sending feedback for", selectedFile, "text:", feedbackText);
    // Provide user notification
    setInfo({ type: "info", message: "Feedback envoyé" });
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
    setOpenFeedback(false);
  };

  const handleOpenModify = (fileRow, uploadRow) => {
    setSelectedFile({
      fileName: fileRow.fileName,
      sender: uploadRow.from,
      dueDate: uploadRow.date,
      recipients: uploadRow.to,
      parentId: fileRow.parentId,
    });
    setModifyComments("");
    setModifyFileInput(null);
    setOpenModify(true);
  };
  const handleFileChange = (e) => setModifyFileInput(e.target.files[0]);
  const handleSendModify = () => {
    // TODO: implement file modify submission logic, e.g. upload new file and comments
    console.log(
      "Modify file for",
      selectedFile,
      modifyFileInput,
      modifyComments
    );
    setInfo({ type: "success", message: "Fichier modifié avec succès" });
    setOpenModify(false);
    setTimeout(() => setInfo({ type: "", message: "" }), 3000);
    fetchDocuments3(userData.id);
  };
  const handleCloseModify = () => setOpenModify(false);

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
      width: 180,
      renderCell: (params) => {
        console.log(params);
        const fileRow =
          params.row.files.find((f) => f.id === params.row.id) || params.row;
        const uploadRow = params.row;
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                changeFileStatus(
                  fileRow.parentId,
                  fileRow.fileName,
                  "Approuvee"
                );
                setInfo({
                  type: "success",
                  message: "Document approuvé avec succès",
                });
                setOpen(true);
                setTimeout(() => setOpen(false), 3000);
                fetchDocuments3(userData.id);
              }}
            >
              Approuver
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                changeFileStatus(fileRow.parentId, fileRow.fileName, "Refuse");
                setInfo({ type: "error", message: "Document refusé" });
                setOpen(true);
                setTimeout(() => setOpen(false), 3000);
                fetchDocuments3(userData.id);
              }}
            >
              Refuser
            </Button>
            <Button
              variant="contained"
              color="info"
              size="small"
              onClick={() => handleOpenFeedback(fileRow, uploadRow)}
            >
              Feedback
            </Button>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => handleOpenModify(fileRow, uploadRow)}
            >
              Modifier Fichier
            </Button>
          </Box>
        );
      },
    },
  ];

  const processUploads = (uploads) => {
    // flatten uploads and files for table rows
    let rows = [];
    uploads.forEach((upload) => {
      upload.files.forEach((file) => {
        rows.push({
          id: `${upload.id}-${file.name}`,
          uploadCode: upload.code,
          fileName: file.name,
          from:
            upload.sender.firstName +
            " " +
            upload.sender.familyName.toUpperCase(),
          uploadDate: new Date(file.uploadDate).toLocaleDateString(),
          to: upload.recipients.join(", "),
          downloadedBy:
            Array.isArray(file.downloadedBy) && file.downloadedBy.length > 0
              ? file.downloadedBy
                  .map((d) =>
                    d.user
                      ? `${d.user.firstName} ${d.user.familyName.toUpperCase()}`
                      : "Utilisateur"
                  )
                  .join(", ")
              : "Non téléchargé",
          date: new Date(upload.dueDate).toLocaleDateString(),
          parentId: upload.id,
          files: [{ ...file, parentId: upload.id }],
        });
      });
    });
    return rows;
  };

  useEffect(() => {
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
    }
  }, [userData?.id, keycloak.authenticated]);

  const pendingDocs = otherStatusDocs["EnAttente"] || { count: 0, data: [] };
  if (docsLoading || userLoading) {
    return <Loader />;
  }
  const rows = processUploads(pendingDocs.data);

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
        PaperProps={{
          style: {
            backgroundColor: "#F5EFFF",
            padding: "15px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Envoyer un feedback</DialogTitle>
        <DialogContent dividers>
          <DataField value={selectedFile.fileName} label="Nom de Document" />
          <DataField value={selectedFile.sender} label="Envoyé Par" />
          <DataField value={selectedFile.dueDate} label="Date Limite" />
          <DataField value={selectedFile.recipients} label="Envoyé A" />
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
        <DialogActions>
          <Button onClick={handleCloseFeedback}>Annuler</Button>
          <Button onClick={handleSendFeedback} disabled={!feedbackText.trim()}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modify File Dialog */}
      <Dialog
        open={openModify}
        onClose={handleCloseModify}
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#F5EFFF",
            padding: "15px",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle>Modifier le fichier</DialogTitle>
        <DialogContent dividers>
          <DataField value={selectedFile.fileName} label="Nom de Document" />
          <DataField value={selectedFile.sender} label="Envoyé Par" />
          <DataField value={selectedFile.dueDate} label="Date Limite" />
          <DataField value={selectedFile.recipients} label="Envoyé A" />

          <Box mt={2}>
            <Button variant="outlined" component="label">
              Choisir un nouveau fichier
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {modifyFileInput && (
              <Typography mt={1}>{modifyFileInput.name}</Typography>
            )}
          </Box>
          <TextField
            margin="dense"
            label="Commentaires"
            type="text"
            fullWidth
            multiline
            minRows={2}
            value={modifyComments}
            onChange={(e) => setModifyComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModify}>Annuler</Button>
          <Button onClick={handleSendModify} disabled={!modifyFileInput}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PendingReports;
