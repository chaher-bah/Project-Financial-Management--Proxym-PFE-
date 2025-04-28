import React ,{useEffect}from 'react'
import DataTable from '../../Components/DataTable/DataTable'
import {Button} from '@mui/material'
import { useDocs } from '../../hooks/useDocs'
import { useGetUserData } from '../../hooks/useGetUserData'
import {useKeycloak} from '@react-keycloak/web'
import Loader from '../../Components/Loader/Loader'
const ToReviewReports = () => {
    const {keycloak} = useKeycloak()
    const { userData ,loading:userLoading} = useGetUserData();
    const {recievedDocuments,fetchDocuments2,loading:docsLoading,downloadFile,changeFileStatus,fetchDocuments3,otherStatusDocs} = useDocs()

    const processUploads = (uploads) => {
      return uploads.map(upload => ({
        id: upload.id,
        uploadCode: upload.code,
        from: upload.sender.firstName + " " + upload.sender.familyName.toUpperCase(),
        to: upload.recipients.join(", "),
        date: new Date(upload.dueDate).toLocaleDateString(),
        uploadColor: upload.color,
        files: upload.files.map(file => ({
          id: file.name,
          fileName: file.name,
          status: file.status,
          parentId: upload.id,
          uploadDate: new Date(file.uploadDate).toLocaleDateString(),
          downloadedBy: Array.isArray(file.downloadedBy) && file.downloadedBy.length > 0
          ? file.downloadedBy.map(d => d.user? `${d.user.firstName} ${d.user.familyName.toUpperCase()}` : "Utilisateur").join(", ")
          : "Non téléchargé",        }))
      }));
    };
    useEffect(() => {
        if (userData?.id && keycloak.authenticated) {
          fetchDocuments3(userData.id);
        }
      }, [userData?.id, keycloak.authenticated]);
      const toReviewDocs   = otherStatusDocs["AReviser"]  || { count: 0, data: [] };console.log("toReviewDocs from page",toReviewDocs);
    const Columns=[
        {field: "uploadCode", headerName: "Code", width: 110}, 
        {field: "fileName", headerName: "Nom de Document", width: 220},
        {field: "from", headerName: "Envoyer Par", width: 130},
        {field:"uploadDate", headerName: "Date d'Envoi", width: 110},
        {field: "to", headerName: "Envoyer A", width: 250},
        {field:"downloadedBy", headerName: "Télécharger Par", width: 150},
        {field: "date", headerName: "Date Limite", width: 110},
        {field: "action", headerName: "Télécharger", width: 150, renderCell: (params) => {if (!params.row.fileName) return null;
          return (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                changeFileStatus(params.row.parentId, params.row.fileName, "EnAttente")
                  .then(() => {
                    downloadFile(params.row.parentId, params.row.fileName,userData.id);
                    fetchDocuments2(userData.id);
                  })
                  .catch(console.error);
              }}
            >
              Télécharger
            </Button>
          );
        }}
      ]
        if (userLoading || docsLoading) {
            return <Loader />;
          }

          console.log("userData",toReviewDocs.data)
  const rowData = processUploads(toReviewDocs.data);
  console.log("rowData",rowData)
  return (

    <DataTable
        columns={Columns}
        rows={rowData}
        title="Documents à Réviser"
        backPath="/reports"
      />
  )
}

export default ToReviewReports