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
import FileActionsMenu from "../../Components/Menus/FileActionsMenu";

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
      renderCell: (params) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FileActionsMenu
              row={params.row}
              fetchDocuments={fetchDocuments3}
              userId={userData.id}
              setAlert={setAlert}
              downloadFileVersion={downloadFileVersion}
            />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleOpenConfirmDialog(params.row)}
            >
              Réexaminer
            </Button>
          </Box>
        );
      },
    },
  ];

  if (userLoading || docsLoading) return <Loader />;

  return (
    <div style={{ margin: 1, maxWidth: "98%" }}>
      {alert.open && (
        <Alert
          severity={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
          sx={{ mb: 4, fontSize: "1.2rem" }}
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
