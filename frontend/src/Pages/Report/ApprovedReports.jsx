import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Reports.css";
import DataTable from "../../Components/DataTable/DataTable";

const ApprovedReports = () => {
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const approvedDocuments = [
    {
      fileName: "Team Classification.txt",
      collaborateurs: "Mohammed, Bilel,Monji",
      date: "2023-03-15",
      onOpen: () => console.log("Opening Team Classification.txt"),
    },
    {
      fileName: "Best Team Rapport.xlsx",
      collaborateurs: "Bilel",
      date: "2023-03-14",
      onOpen: () => console.log("Opening Best Team Rapport.xlsx"),
    },
    {
      fileName: "DevOps Tools Subscription",
      collaborateurs: "Lamia",
      date: "2023-03-13",
      onOpen: () => console.log("Opening DevOps Tools Subscription"),
    },
    {
      fileName: "Annual Budget.pdf",
      collaborateurs: "Mohammed",
      date: "2023-03-12",
      onOpen: () => console.log("Opening Annual Budget.pdf"),
    },
    {
      fileName: "Project Timeline.docx",
      collaborateurs: "Bilel",
      date: "2023-03-11",
      onOpen: () => console.log("Opening Project Timeline.docx"),
    },
  ];
  const testColumns = [
    {field: "fileName", headerName: "Nom de Document", width: 300},
    {field: "collaborateurs", headerName: "Collaborateurs", width: 250},
    {field: "date", headerName: "Date Limite", width: 150},
    {field: "action", headerName: "Action", width: 200, renderCell: (params) => (
      <Button variant="contained" color="success" size="small" onClick={()=>{console.log("Opening")}}>
        Open
      </Button>
    )},]

    const testRows = [
      {id: 1, fileName: "Team Classification.txt", collaborateurs: "Mohammed, Bilel,Monji", date: "2023-03-15"},
      {id: 2, fileName: "Best Team Rapport.xlsx", collaborateurs: "Bilel", date: "2023-03-14"},
      {id: 3, fileName: "DevOps Tools Subscription", collaborateurs: "Lamia", date: "2023-03-13"},
      {id: 4, fileName: "Annual Budget.pdf", collaborateurs: "Mohammed", date: "2023-03-12"},
      {id: 5, fileName: "Project Timeline.docx", collaborateurs: "Bilel", date: "2023-03-11"},
    ]
  
  return (
      <DataTable
        columns={testColumns}
        rows={testRows}
        title="Documents Approuvés"
        backPath="/reports"
      />
  );
};

export default ApprovedReports;
