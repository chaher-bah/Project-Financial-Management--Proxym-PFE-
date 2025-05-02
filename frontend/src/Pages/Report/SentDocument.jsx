import React, { useEffect, useState } from "react";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
import { processUploads } from "../../utils/processColumns";
import DataTable from "../../Components/DataTable/DataTable";
import { Button, Box, Alert } from "@mui/material";
import ConfirmationDialog from "../../Components/DocumentCards/ConfirmationDialog";
import FileActionsMenu from "../../Components/Menus/FileActionsMenu";
const SentDocument = () => {
  const { keycloak } = useKeycloak();
  const { userData ,getUsersByRole} = useGetUserData();
  const { fetchDocuments3, sentDocuments2, downloadFile, deleteFile,downloadFileVersion ,uploadFiles} =
    useDocs();
  useEffect(() => {
    const fetchPmoUsers = async () => {
      try {
        const response = await getUsersByRole("Pmo");
        setPmoUser(response.users);
      } catch (error) {
        console.error("Error fetching PMO users:", error);
      }
    };
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
      fetchPmoUsers(); 
    }
  }, [userData?.id, keycloak.authenticated]);

  const processedUploads = processUploads(sentDocuments2.data);
  const [info, setInfo] = useState({ type: "", message: "" });
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pmoUser, setPmoUser] = useState(null);

  const handleOpenConfirmDialog = (file) => {
    setSelectedFile(file);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedFile(null);
  };
  const handleDeleteFile = () => {
    if (selectedFile) {
      deleteFile(selectedFile.parentId, selectedFile.fileName)
        .then(() => {
          setInfo({
            type: "success",
            message: `Le document ${selectedFile.fileName} a été supprimé avec succès.`,
          });
          setOpen(true);
          setTimeout(() => setOpen(false), 3000);
          fetchDocuments3(userData?.id); // Refresh the data
        })
        .catch((error) => {
          setInfo({
            type: "error",
            message: `Erreur lors de la suppression du document ${selectedFile.fileName}.`,
          });
          setOpen(true);
          setTimeout(() => setOpen(false), 3000);
        });
    }
    handleCloseConfirmDialog();
  };
  const handleSendToPmo = async (file) => {
    try {
      if (!pmoUser.length) {
        setInfo({
          type: "warning",
          message: "Aucun utilisateur PMO trouvé",
        });
        setOpen(true);
        return;
      }
  
      // Get PMO user IDs
      const pmoUserIds = pmoUser.map(user => user._id); 
      
      // Create dummy file object from existing file data
      const dummyFile = new File(
        [""], // Empty content since file already exists
        file.fileName, 
        { type: "application/octet-stream" }
      );
  
      await uploadFiles(
        [dummyFile], 
        pmoUserIds,
        file.date,
        userData.id,
        "",
        true, // Set to true to send to PMO
      );
  
      setInfo({
        type: "success",
        message: "Document envoyé au PMO avec succès",
      });
      setOpen(true);
      setTimeout(() => setOpen(false), 3000);
      
      // Refresh documents
      fetchDocuments3(userData.id);
  
    } catch (error) {
      console.error("Error sending to PMO:", error);
      setInfo({
        type: "error",
        message: "Erreur lors de l'envoi au PMO",
      });
      setOpen(true);
      setTimeout(() => setOpen(false), 3000);
    }
  };
  
  const Columns = [
    { field: "uploadCode", headerName: "Code", width: 95 },
    { field: "comnts", headerName: "Commentaires", width: 120 },
    { field: "fileName", headerName: "Nom de Document", width: 150 },
    { field: "uploadDate", headerName: "Date d'Envoi", width: 110 },
    { field: "to", headerName: "Envoyer A", width: 150 },
    { field: "downloadedBy", headerName: "Télécharger Par", width: 150 },
    { field: "date", headerName: "Date Limite", width: 90 },
    { field: "status", headerName: "Status", width: 100 },
    { field: "fileStatus", headerName: "Status de Document", width: 110 },
    {
      field: "operation",
      headerName: "Operations",
      width: 200,
      renderCell: (params) => {
        if (!params.row.fileName) return null;
        console.log("params", params);
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                downloadFile(
                  params.row.parentId,
                  params.row.fileName,
                  userData.id
                )
                  .then(() => {
                    fetchDocuments3(userData.id);
                    setOpen(true);
                    setInfo({
                      type: "success",
                      message: "Le document a été téléchargé avec succès.",
                    });
                    setTimeout(() => {
                      setOpen(false);
                    }, 3000);
                  })
                  .catch((error) => {
                    console.error(error);
                    setOpen(true);
                    setInfo({
                      type: "error",
                      message: "Erreur lors du téléchargement du document.",
                    });
                    setTimeout(() => {
                      setOpen(false);
                    }, 3000);
                  });
              }}
            >
              Télécharger
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleOpenConfirmDialog(params.row)}

            >
              Effacer
            </Button>
            {params.row.fileStatus === "Approuvee" && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleSendToPmo(params.row)}
              sx={{ mt: 1 }}
            >
              Envoyer A Pmo
            </Button>
          )}
          {params.row.fileStatus === "Consultee" && (
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <FileActionsMenu 
                row={params.row} 
                fetchDocuments={fetchDocuments3}
                userId={userData?.id}
                setAlert={setInfo}
                downloadFileVersion={downloadFileVersion}
              />
            </Box>
          )}
          </Box>
        );
      },
    },
  ];
  return (
    <div style={{ margin: 1, maxWidth: "98%" }}>
      {open && (
        <Alert severity={info.type} sx={{ mb: 4, fontSize: "1.2rem" }}>
          {info.message}
        </Alert>
      )}
      <DataTable
        columns={Columns}
        rows={processedUploads}
        title="Documents Envoyés"
        backPath="/reports"
        expand={true}
      />
      <ConfirmationDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleDeleteFile}
        title="Confirmation de Suppression"
        content={`Êtes-vous sûr de vouloir supprimer le document ${selectedFile?.fileName} ?`}
        confirmButtonColor="error"
        confirmButtonText="Supprimer"
        selectedItem={selectedFile?.fileName}
        selectedItemLabel="Document"
      />
    </div>
  );
};

export default SentDocument;
