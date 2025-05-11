import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Checkbox,
  FormControl,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useGetUserData } from "../../hooks/useGetUserData";
import { useGroups } from "../../hooks/useGroups";
import Loader from "../../Components/Loader/Loader.jsx";

const AssigneeManagement = () => {
  const [rows, setRows] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [modifiedRowIds, setModifiedRowIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { getAllUsers } = useGetUserData();
  const { groupData, setGroupToUser } = useGroups();

  // Fetch initial data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers();
        const updatedRows = response.users.map((user) => ({
          id: user._id, 
          username: `${user.firstName} ${user.familyName.toUpperCase()}`,
          email: user.email,
          equipe: user.group ? user.group.name : "",
          variant: user.position || "",
          originalEquipe: user.group ? user.group.name : "",
          originalVariant: user.position || "",
        }));
        setRows(updatedRows);
        setOriginalRows([...updatedRows]);
      } catch (error) {
        console.error("Error fetching users:", error);
        setSnackbar({
          open: true,
          message: "Erreur lors du chargement des utilisateurs",
          severity: "warning",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const teamVariants = groupData.reduce((acc, group) => {
    acc[group.name] = (group.variants).map((v) => v.name);
    return acc;
  }, {});

  // Handle team selection change
  const handleEquipeChange = (event, params) => {
    const newEquipe = event.target.value;
    const updatedRows = rows.map((row) => {
      if (row.id === params.id) {
        // Check if the row is now different from original
        const isModified = newEquipe !== row.originalEquipe || row.variant !== row.originalVariant;
        
        // Update modified rows tracking
        updateModifiedRows(row.id, isModified);
        
        return { ...row, equipe: newEquipe, variant: "" };
      }
      return row;
    });
    setRows(updatedRows);
  };

  // Handle variant checkbox change
  const handleVariantChange = (rowId, variantName, checked) => {
    const updatedRows = rows.map((row) => {
      if (row.id === rowId) {
        const newVariant = checked ? variantName : "";
        
        // Check if the row is now different from original
        const isModified = row.equipe !== row.originalEquipe || newVariant !== row.originalVariant;
        
        // Update modified rows tracking
        updateModifiedRows(row.id, isModified);
        
        return { ...row, variant: newVariant };
      }
      return row;
    });
    setRows(updatedRows);
  };

  // Track which rows have been modified
  const updateModifiedRows = (rowId, isModified) => {
    setModifiedRowIds(prevState => {
      const newState = new Set(prevState);
      if (isModified) {
        newState.add(rowId);
      } else {
        newState.delete(rowId);
      }
      return newState;
    });
  };

  // Reset to original data
  const handleReset = () => {
    setRows([...originalRows]);
    setModifiedRowIds(new Set());
    setSnackbar({
      open: true,
      message: "Modifications annulées",
      severity: "info"
    });
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (modifiedRowIds.size === 0) {
      setSnackbar({
        open: true,
        message: "Aucune modification à enregistrer",
        severity: "info"
      });
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    // Process each modified row
    for (const rowId of modifiedRowIds) {
      const row = rows.find(r => r.id === rowId);
      
      if (!row.equipe || !row.variant) {
        failCount++;
        continue;
      }

      const groupId = groupData.find(g => g.name === row.equipe)?._id;
      
      if (!groupId) {
        failCount++;
        continue;
      }

      try {
        await setGroupToUser(row.id, groupId, row.variant);
        successCount++;
      } catch (error) {
        console.error(`Error updating user ${row.username}:`, error);
        failCount++;
      }
    }

    // Update original rows and clear modified tracking
    if (successCount > 0) {
      const updatedOriginalRows = rows.map(row => ({
        ...row,
        originalEquipe: row.equipe,
        originalVariant: row.variant
      }));
      setOriginalRows(updatedOriginalRows);
      setRows(updatedOriginalRows);
      setModifiedRowIds(new Set());
    }

    setLoading(false);
    setSnackbar({
      open: true,
      message: `${successCount} utilisateur(s) mis à jour, ${failCount} échec(s)`,
      severity: successCount > 0 ? (failCount === 0 ? "success" : "warning") : "error"
    });
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Define base columns
  const columns = [
    {
      field: "username",
      headerName: "Nom Utilisateur",
      flex: 0.7,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "E-mail Utilisateur",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "equipe",
      headerName: "Equipes",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <FormControl fullWidth>
          <Select
            value={params.value || ""}
            onChange={(event) => handleEquipeChange(event, params)}
            displayEmpty
          >
            <MenuItem value="">Equipes</MenuItem>
            {groupData.map((group) => (
              <MenuItem key={group.name} value={group.name}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "variant",
      headerName: "Variants",
      flex: 0.9,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.row.equipe) {
          return <div>Sélectionnez d'abord une équipe</div>;
        }

        const variants = teamVariants[params.row.equipe] || [];
        return (
          <Box sx={{ display: "flex", gap: 2 }}>
            {variants.map((variant) => (
              <Box
                key={variant}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="body2">{variant}</Typography>
                <Checkbox
                  checked={params.row.variant === variant}
                  onChange={(event) =>
                    handleVariantChange(
                      params.row.id,
                      variant,
                      event.target.checked
                    )
                  }
                />
              </Box>
            ))}
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        p: 1,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          fontFamily: "sans-serif",
          justifyContent: "space-between",
          m: 5,
        }}
      >
        Gestion des Assignees
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: "sans-serif",
          color: "var(--dark-color)",
          fontStyle: "italic",
          m: 2,
          mb: 5,
        }}
      >
        Attribuer chacune des utilisateurs à une équipe
      </Typography>
      
      {loading ? (
        <Loader />
      ) : (
        <Box sx={{ height: 400, width: '100%', mb: 5 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            getRowHeight={() => "auto"}
            getRowClassName={(params) => 
              modifiedRowIds.has(params.id) ? 'modified-row' : ''
            }
            sx={{
              color: "#333",
              border: "none",
              wordBreak: "break-word",

              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(146, 54, 54, 0.12)",
                fontFamily: "System-ui, sans-serif",
                fontSize: "1.2rem",
                padding: "8px",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "var(--light-color)",
                fontFamily: "System-ui, sans-serif",
                fontWeight: "bold",
                fontSize: "1.3rem",
                padding: "10px",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "var(--light-color)",
                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              },
              "& .MuiDataGrid-cell--editing": {
                backgroundColor: "rgb(114, 47, 173)",
                color: "#333",
              },
              "& .MuiInputBase-input": {
                color: "#333",
                backgroundColor: "rgba(229, 32, 32, 0.05)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "var(--primary-color)",
                cursor: "pointer",
                color: "white",
              },
              "& .modified-row": {
                backgroundColor: "rgba(144, 202, 249, 0.15)",
              },
            }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button 
          variant="outlined"
          color="warning" 
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          disabled={loading || modifiedRowIds.size === 0}
          sx={{ mt: 2, width: 200 }}
        >
          Réinitialiser
        </Button>

        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DoneAllIcon />} 
          onClick={handleSaveAll}
          disabled={loading || modifiedRowIds.size === 0}
          sx={{ mt: 2, width: 200 }}
        >
          Enregistrer ({modifiedRowIds.size})
        </Button>
      </Box>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssigneeManagement;
