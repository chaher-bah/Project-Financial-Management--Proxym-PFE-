// DataTable.js - Modified with expandable rows
import React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DataTable = ({ columns, rows, title, backPath,expand }) => {
  const navigate = useNavigate();
  const [expandedParents, setExpandedParents] = React.useState(new Set());

  const toggleParent = (parentId) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  const enhancedColumns = [
    {
      field: "actions",
      headerName: " ",
      width: 50,
      renderCell: (params) => {
        if (params.row.isChild) return null;
        return (
          <IconButton size="small" onClick={() => toggleParent(params.row.id)}>
            <ExpandMoreIcon
              style={{
                transform: expandedParents.has(params.row.id)
                  ? "rotate(180deg)"
                  : "none",
              }}
            />
          </IconButton>
        );
      },
    },
    ...columns.map((col) => ({
      ...col,
      renderCell: (params) => {
        // Preserve original renderCell if exists
        const originalContent = col.renderCell
          ? col.renderCell(params)
          : params.formattedValue;

        return (
          <div style={{ padding: "8px 0px" }}>
            {params.row.isChild ? (
              <div style={{ paddingLeft: 20, paddingBottom: 15 }}>
                {col.field === "uploadCode" ? null : originalContent}
              </div>
            ) : (
              originalContent
            )}
          </div>
        );
      },
    })),
  ];
  const allRows = rows.flatMap((row) => {
    const parentRow = {
      ...row,
      id: row.id,
      isChild: false,
      hasChildren: row.files.length > 0,
    };

    const childRows = expandedParents.has(row.id)
      ? row.files.map((file, index) => ({
          ...file,
          id: `${row.id}-${index}`,
          parentId: row.id,
          isChild: true,
          uploadCode: "", // Empty for child rows
          from: row.from,
          to: row.to,
          date: row.date,
        }))
      : [];

    return [parentRow, ...childRows];
  });
  const colorClasses = {};
  rows.forEach((row) => {
    if (row.uploadColor) {
      colorClasses[`parent-row-${row.id}`] = {
        backgroundColor: row.uploadColor,
      };
    }
  });
  return (
    <Container
      className="data-table-container"
      style={{ margin: 1, boxSizing: "unset", maxWidth: "100%" }}
    >
      <Box
        className="data-table-header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ m: 2.5, fontWeight: "600" }}
        >
          {title}
        </Typography>
        {backPath && (
          <Button
            onClick={() => navigate(backPath)}
            className="back-button"
            variant="contained"
            color="primary"
            sx={{ marginLeft: 2 }}
          >
            <ArrowBackIcon sx={{ marginRight: 1 }} />
            Retour à la liste des documents
          </Button>
        )}
      </Box>
      <Box className="data-table-content" sx={{ width: "100%" }}>
        <DataGrid
          rows={allRows}
          columns={expand? enhancedColumns: columns}
          disableSelectionOnClick
          hideFooter
          getRowId={(row) => row.id}
          isRowSelectable={(params) => !params.row.isChild}
          getRowClassName={(params) => {
            if (params.row.isChild) return "child-row";
            return `parent-row parent-row-${params.row.id}`;
          }}
          getRowHeight={() => "auto"}
          sx={{
            // Standard styles
            color: "#333",
            display: "flex",

            "& .MuiDataGrid span": {
              color: "#333",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#dbd8e3",
              fontFamily: "System-ui, sans-serif",
            },
            "& .MuiDataGrid-filler": {
              backgroundColor: "#dbd8e3",
            },

            ".parent-row": {
              backgroundColor: "hsla(123, 18.10%, 53.50%, 0.51)",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              overflow: "visible !important",
              margin:"8px 0px 8px 0px",
            },
            "& .MuiDataGrid-row": {
              maxHeight: "none !important",          },
            // Dynamic color classes
            ...colorClasses,
          }}
        />
      </Box>
    </Container>
  );
};

export default DataTable;
