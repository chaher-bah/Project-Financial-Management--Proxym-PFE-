import React, { useEffect,useState } from "react";
import DataTable from "../../Components/DataTable/DataTable";
import { Button,Alert } from "@mui/material";
import { useDocs } from "../../hooks/useDocs";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
import Loader from "../../Components/Loader/Loader";
import { processUploads } from "../../utils/processColumns";
const ToReviewReports = () => {
  const { keycloak } = useKeycloak();
  const { userData, loading: userLoading } = useGetUserData();
  const {
    loading: docsLoading,
    downloadFile,
    changeFileStatus,
    fetchDocuments3,
    otherStatusDocs,
  } = useDocs();
  useEffect(() => {
    if (userData?.id && keycloak.authenticated) {
      fetchDocuments3(userData.id);
    }
  }, [userData?.id, keycloak.authenticated]);
   const [info, setInfo] = useState({ type: "", message: "" });
    const [open, setOpen] = useState(false);
  const toReviewDocs = otherStatusDocs["AReviser"] || { count: 0, data: [] };
  const Columns = [
    { field: "uploadCode", headerName: "Code", width: 100 },
    { field: "comnts", headerName: "Commentaires", width: 150 },
    { field: "fileName", headerName: "Nom de Document", width: 180 },
    { field: "from", headerName: "Envoyer Par", width: 130 },
    { field: "uploadDate", headerName: "Date d'Envoi", width: 110 },
    { field: "to", headerName: "Envoyer A", width: 200 },
    { field: "downloadedBy", headerName: "Télécharger Par", width: 150 },
    { field: "date", headerName: "Date Limite", width: 90 },
    {
      field: "action",
      headerName: "Télécharger",
      width: 180,
      renderCell: (params) => {
        if (!params.row.fileName) return null;
        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => {
              changeFileStatus(
                params.row.parentId,
                params.row.fileName,
                "EnAttente"
              )
                .then(() => {
                  downloadFile(
                    params.row.parentId,
                    params.row.fileName,
                    userData.id
                  );
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
                .catch(error => {
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
        );
      },
    },
  ];
  if (userLoading || docsLoading) {
    return <Loader />;
  }

  console.log("userData", toReviewDocs.data);
  const rowData = processUploads(toReviewDocs.data);



  return (    <div style={{ margin: 1, maxWidth: "98%" }}>

    {open && (
            <Alert severity={info.type} sx={{ mb: 4, fontSize: "1.2rem" }}>
              {info.message}
            </Alert>
          )}
    <DataTable
      columns={Columns}
      rows={rowData}
      title="Documents à Réviser"
      backPath="/reports"
      expand={true}
    /></div>
  );
};

export default ToReviewReports;
