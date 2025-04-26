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
    const {recievedDocuments,fetchDocuments,changeUploadStatus,loading:docsLoading,downloadFile} = useDocs()
    useEffect(() => {
        if (userData?.id && keycloak.authenticated) {
          fetchDocuments(userData.id);
        }
      }, [userData?.id, keycloak.authenticated]);
 
    const Columns=[
        {field: "fileName", headerName: "Nom de Document", width: 300},
        {field: "from", headerName: "Envoyer Par", width: 250},
        {field: "to", headerName: "Envoyer A", width: 250},
        {field: "date", headerName: "Date Limite", width: 150},
        {field: "action", headerName: "Télécharger", width: 200, renderCell: (params) => (
          <Button variant="contained" color="success" size="small" onClick={()=>{
            changeUploadStatus(params.row.id,"EnAttente").then((response) => {
                console.log("changeUploadStatus:",response)
                downloadFile(params.row.id,params.row.fileName);
                fetchDocuments(userData.id);
            })
            .catch((error) => {
                console.error("Error changing upload status:", error);
            })

            }}>
            Télécharger
          </Button>
        )},]
        if (userLoading || docsLoading) {
            return <Loader />;
          }
        const rowData = Array.isArray(recievedDocuments.data) 
  ? recievedDocuments.data.map((doc) => ({
      id: doc.id, 
      fileName: doc.fileName,
      from: doc.sender,
        to: doc.recipients.join(", "), 
      date: new Date(doc.dueDate).toLocaleDateString(),
    }))
  : [];
        


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