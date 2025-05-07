import React, { lazy, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Loader from "../../Components/Loader/Loader.jsx";
import { DataGrid } from "@mui/x-data-grid";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { useGroups } from "../../hooks/useGroups.jsx";
const { ConfirmationDialog } = lazy(() =>
  import("../../Components/DocumentCards/ConfirmationDialog.jsx")
);

function EquipesManagement() {
  const { groupData, addGroup, deleteGroup, updateGroup, loading, info: groupsInfo } = useGroups();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isSpecialRole, setIsSpecialRole] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    roleType: "normal",
    Junior: "",
    Confirme: "",
    Senior: "",
    specialRole: "",
    specialTarif: "",
  });

  // Show Snackbar when groupsInfo updates
  useEffect(() => {
    if (groupsInfo.message) {
      setSnackbarMessage(groupsInfo.message);
      setSnackbarOpen(true);
    }
  }, [groupsInfo]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const renderRateCell = (params) => {
    if (params.value === null) {
      return (
        <Tooltip title="Non disponible">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "repeating-linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
              color: "rgba(0,0,0,0.38)",
            }}
          >
            <BlockIcon fontSize="large" />
          </Box>
        </Tooltip>
      );
    }
    return params.value;
  };

  const columns = [
    {
      field: "name",
      headerName: "EQUIPE",
      flex: 0.8,
      editable: false,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => params.row.name,
    },
    {
      field: "Junior",
      headerName: "TARIF JUNIOR ($/J)",
      type: "number",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: renderRateCell,
    },
    {
      field: "Confirme",
      headerName: "TARIF CONFIRME ($/J)",
      type: "number",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: renderRateCell,
    },
    {
      field: "Senior",
      headerName: "TARIF SENIOR ($/J)",
      type: "number",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: renderRateCell,
    },
    {
      field: "special",
      headerName: "Rôle Spécial",
      flex: 0.6,
      // width: 300,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => {
        if (params.row.special === false) {
          return (
            <Tooltip title="Non disponible">
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "repeating-linear-gradient(45deg, rgba(0,0,0,0.05), rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
                  color: "rgba(0,0,0,0.38)",
                }}
              >
                <BlockIcon fontSize="large" />
              </Box>
            </Tooltip>
          );
        }
        return `${params.row.variants.map((v) => v.name)} - ${params.row.variants.map((v) => v.tarif)} ($/J)`;
      },
    },
  ];

  const handleRowClick = (params) => {
    setSelectedRow(params.row);
    setIsSpecialRole(params.row.special);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setAddDialogOpen(false);
    setSelectedRow(null);
    setFormData({
      name: "",
      roleType: "normal",
      Junior: "",
      Confirme: "",
      Senior: "",
      specialRole: "",
      specialTarif: "",
    });
  };

  const handleSaveChanges = async () => {
    if (selectedRow) {
      const { id, name, variants, special } = selectedRow;
      await updateGroup(id, name, variants, special);
      setDialogOpen(false);
    }
  };

  const handleDeleteRow = async () => {
    if (selectedRow) {
      await deleteGroup(selectedRow.id);
      setDialogOpen(false);
    }
  };
  const handleFieldChange = (field, value) => {
    setSelectedRow((prev) => {
      if (field === "name" ) {
        return { ...prev, name: value };
      } else if (isSpecialRole) {
        const updatedVariants = [
          { ...prev.variants[0], tarif: value === "" ? null : Number(value) },
        ];
        return { ...prev, variants: updatedVariants };
      } else {
        const variantName = field;
        const updatedVariants = prev.variants.map((v) =>
          v.name === variantName ? { ...v, tarif: value === "" ? null : Number(value) } : v
        );
        
        return { ...prev, variants: updatedVariants };
      }
    });
  };
  const handleAddFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddGroup = async () => {
    const { name, roleType, Junior, Confirme, Senior, specialRole, specialTarif } = formData;
    let variants = [];
    let special = false;

    if (roleType === "normal") {
      variants = [
        { name: "Junior", tarif: Junior ? Number(Junior) : null },
        { name: "Confirme", tarif: Confirme ? Number(Confirme) : null },
        { name: "Senior", tarif: Senior ? Number(Senior) : null },
      ];
    } else {
      variants = [{ name: specialRole, tarif: specialTarif ? Number(specialTarif) : null }];
      special = true;
    }

    await addGroup(name, variants, special);
    setAddDialogOpen(false);
    setFormData({
      name: "",
      roleType: "normal",
      Junior: "",
      Confirme: "",
      Senior: "",
      specialRole: "",
      specialTarif: "",
    });
  };

  const renderAddDialogContent = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 5 }}>
        <TextField
          label="Nom de l'équipe"
          value={formData.name}
          onChange={(e) => handleAddFieldChange("name", e.target.value)}
          fullWidth
          variant="outlined"
        />
        <Typography variant="subtitle1">Type de rôle</Typography>
        <RadioGroup
          row
          value={formData.roleType}
          onChange={(e) => handleAddFieldChange("roleType", e.target.value)}
        >
          <FormControlLabel value="normal" control={<Radio />} label="Normal" />
          <FormControlLabel value="special" control={<Radio />} label="Special" />
        </RadioGroup>
        {formData.roleType === "normal" ? (
          <>
            <TextField
              label="Tarif Junior ($/J)"
              type="number"
              value={formData.Junior}
              onChange={(e) => handleAddFieldChange("Junior", e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Tarif Confirmé ($/J)"
              type="number"
              value={formData.Confirme}
              onChange={(e) => handleAddFieldChange("Confirme", e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Tarif Senior ($/J)"
              type="number"
              value={formData.Senior}
              onChange={(e) => handleAddFieldChange("Senior", e.target?.value || "")}
              fullWidth
              variant="outlined"
            />
          </>
        ) : (
          <>
            <TextField
              label="Nom du rôle spécial"
              value={formData.specialRole}
              onChange={(e) => handleAddFieldChange("specialRole", e.target.value)}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Tarif ($/J)"
              type="number"
              value={formData.specialTarif}
              onChange={(e) => handleAddFieldChange("specialTarif", e.target.value)}
              fullWidth
              variant="outlined"
            />
          </>
        )}
      </Box>
    );
  };

  const renderDialogContent = () => {
    if (!selectedRow) return null;

    if (isSpecialRole) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 5 }}>
          <TextField
            label="Équipe"
            value={selectedRow.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            fullWidth
            variant="outlined"
          />
          <TextField
        label="Rôle Spécial"
        value={selectedRow.variants[0]?.name || ""}
        onChange={(e) => {
          const updatedVariants = [{ ...selectedRow.variants[0], name: e.target.value }];
          setSelectedRow({ ...selectedRow, variants: updatedVariants });
        }}
        fullWidth
        variant="outlined"
      />
          <TextField
            label="Tarif ($/J)"
            type="number"
            value={selectedRow.variants.map((v) => v.tarif)}
            onChange={(e) => handleFieldChange("specialRate", e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 5 }}>
        <TextField
          label="Équipe"
          value={selectedRow.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Tarif Junior ($/J)"
          type="number"
          value={selectedRow.variants.find((v) => v.name === "Junior")?.tarif || ""}
          onChange={(e) => handleFieldChange("Junior", e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Non disponible"
        />
        <TextField
          label="Tarif Confirmé ($/J)"
          type="number"
          value={selectedRow.variants.find((v) => v.name === "Confirme")?.tarif || ""}
          onChange={(e) => handleFieldChange("Confirme", e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Non disponible"
        />
        <TextField
          label="Tarif Senior ($/J)"
          type="number"
          value={selectedRow.variants.find((v) => v.name === "Senior")?.tarif || ""}
          onChange={(e) => handleFieldChange("Senior", e.target.value)}
          fullWidth
          variant="outlined"
          placeholder="Non disponible"
        />
      </Box>
    );
  };

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={3000}
      />
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
            m: 7,
          }}
        >
          Configurations des Tarifs des Equipes
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, m: 2, width: "max-content" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--design-color)", fontSize: "1.2rem" }}
            startIcon={<AddBoxIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            Ajouter une équipe
          </Button>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "sans-serif",
              color: "var(--dark-color)",
              fontStyle: "italic",
            }}
          >
            Cliquez sur une ligne pour modifier les tarifs ou supprimer l'équipe.
          </Typography>
        </Box>

        {loading ? (
          <Loader />
        ) : (
          <DataGrid
            rows={groupData.map((group) => ({
              id: group._id,
              name: group.name,
              Junior: group.variants.find((v) => v.name === "Junior")?.tarif || null,
              Confirme: group.variants.find((v) => v.name === "Confirme")?.tarif || null,
              Senior: group.variants.find((v) => v.name === "Senior")?.tarif || null,
              special: group.special,
              variants: group.variants,
            }))}
            columns={columns}
            onRowClick={handleRowClick}
            getRowHeight={() => "auto"}
            sx={{
              color: "#333",
              border: "none",
              wordBreak:"break-word",

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
                backgroundColor: "rgb(19, 19, 19)",
              },
              "& .MuiInputBase-input": {
                color: "#333",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "var(--primary-color)",
                cursor: "pointer",
                color: "white",
              },
            }}
          />
        )}
        {/* Modification dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: "#F5EFFF",
              padding: "15px",
              borderRadius: "16px",
            },
          }}
        >
          <DialogTitle>
            {isSpecialRole
              ? `Modifier le rôle ${selectedRow?.special}`
              : `Modifier les tarifs pour ${selectedRow?.name || ""}`}
          </DialogTitle>
          <DialogContent dividers>{renderDialogContent()}</DialogContent>
          <DialogActions sx={{ display: "flex", justifyContent: "flex-end", gap: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteRow}
              startIcon={<DeleteIcon />}
            >
              Supprimer
            </Button>
            <Button onClick={handleDialogClose}>Annuler</Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              color="primary"
              startIcon={<DoneAllIcon />}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
        {/* Creating dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={handleDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            style: {
              backgroundColor: "#F5EFFF",
              padding: "15px",
              borderRadius: "16px",
            },
          }}
        >
          <DialogTitle>Ajouter une équipe</DialogTitle>
          <DialogContent dividers>{renderAddDialogContent()}</DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Annuler</Button>
            <Button
              onClick={handleAddGroup}
              variant="contained"
              color="primary"
              startIcon={<DoneAllIcon />}
            >
              Enregistrer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default EquipesManagement;