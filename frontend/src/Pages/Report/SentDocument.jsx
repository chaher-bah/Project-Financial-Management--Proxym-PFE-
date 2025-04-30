import React, { useEffect, useState } from "react";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
import { processUploads } from "../../utils/processColumns";
import DataTable from "../../Components/DataTable/DataTable";
import { Button, Box,Alert } from "@mui/material";
import ConfirmationDialog from "../../Components/DocumentCards/ConfirmationDialog";
const SentDocument = () => {
  const { keycloak } = useKeycloak();
  const { userData } = useGetUserData();
  const { fetchDocuments3, sentDocuments2, downloadFile, deleteFile } =
    useDocs();
  useEffect(() => {
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
    }
  }, [userData?.id, keycloak.authenticated]);
  const processedUploads = processUploads(sentDocuments2.data);
  const [info, setInfo] = useState({ type: "", message: "" });
  const [open, setOpen] = useState(false);
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
    }


  const Columns = [
    { field: "uploadCode", headerName: "Code", width: 95 },
    { field: "comnts", headerName: "Commentaires", width: 150 },
    { field: "fileName", headerName: "Nom de Document", width: 150 },
    { field: "uploadDate", headerName: "Date d'Envoi", width: 110 },
    { field: "to", headerName: "Envoyer A", width: 200 },
    { field: "downloadedBy", headerName: "Télécharger Par", width: 200 },
    { field: "date", headerName: "Date Limite", width: 90 },
    { field: "status", headerName: "Status", width: 80 },
    { field: "fileStatus", headerName: "Status de Document", width: 150 },
    {
      field: "operation",
      headerName: "Operations",
      width: 170,
      renderCell: (params) => {
        if (!params.row.fileName) return null;
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
              // {() => {
              //   deleteFile(params.row.parentId, params.row.fileName)
              //     .then(() => {
              //       fetchDocuments3(userData.id);
              //       setOpen(true);
              //       setInfo({
              //         type: "success",
              //         message: "Le document a été supprimé avec succès.",
              //       });
              //       setTimeout(() => {
              //         setOpen(false);
              //       }, 3000);
              //     })
              //     .catch((error) => {
              //       console.error(error);
              //       setOpen(true);
              //       setInfo({
              //         type: "error",
              //         message: "Erreur lors de la suppression du document.",
              //       });
              //       setTimeout(() => {
              //         setOpen(false);
              //       }, 3000);
              //     });
              // }}
            >
              Effacer
            </Button>
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
