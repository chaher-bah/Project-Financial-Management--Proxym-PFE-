import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Badge,
} from "@mui/material";
import { AddCircleOutline, DeleteOutline, Warning } from "@mui/icons-material";
import { useGetUserData } from "../../hooks/useGetUserData";
import { useKeycloak } from "@react-keycloak/web";
import { useRole } from "../../hooks/useRole";

// Add Role Dialog Component
const AddRoleDialog = ({ open, onClose, onAdd }) => {
  const [roleName, setRoleName] = useState("");
  const { addRole } = useRole();

  const handleAdd = async () => {
    if (roleName.trim()) {
      await addRole(roleName.trim());
      onAdd(roleName.trim());
      setRoleName("");
      onClose();
      // Refresh the page after adding the role
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#F5EFFF",
          padding: "15px",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>Ajouter un role</DialogTitle>
      <DialogContent>
        <TextField
          label="Nom du role"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!roleName}>
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Role Dialog Component
const DeleteRoleDialog = ({ open, onClose, roles, onDelete }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const { deleteRole, error: errorRole } = useRole();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleDelete = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setError(null);

    try {
      await deleteRole(selectedRole); // Call deleteRole from useRole
      onDelete(selectedRole); // Update local state (if necessary)
      setSelectedRole("");
      if (!errorRole) {
        onClose();
      }
      window.location.reload();
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "Impossible de supprimer le rôle car il est attribué aux utilisateurs."
        );
      } else {
        setError("Échec de la suppression du rôle. Veuillez réessayer.");
      }
    }
    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#F5EFFF",
          padding: "15px",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>Effacer un role</DialogTitle>
      <DialogContent>
        {errorRole && (
          <Typography color="error" sx={{ mb: 2 }}>
            {errorRole}
          </Typography>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Role à effacer</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.length > 0
              ? roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))
              : []}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading || !selectedRole}
        >
          {loading ? "Suppression..." : "Effacer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// User Dialog Component
const UserDialog = ({ open, onClose, user, roles, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [action, setAction] = useState("add");
  const { addRoleToUser, removeRoleFromUser, loading, setLoading } = useRole();

  const handleApply = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      console.log("user", user, "role", selectedRole, "action", action);
      if (action === "add") {
        await addRoleToUser(user.id, selectedRole); // Call addRoleToUser
      } else if (action === "remove") {
        await removeRoleFromUser(user.id, selectedRole); // Call removeRoleFromUser
      }
      onUpdate(user, selectedRole, action);
      setSelectedRole("");
      setAction("add");
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update user roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "#F5EFFF",
          padding: "15px",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>{`${
        user.firstName
      } ${user.familyName.toUpperCase()}`}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Roles actuels:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {user.roles.map((role) => (
            <Chip
              key={role}
              label={role}
              size="small"
              sx={{
                backgroundColor: "var(--design-color)",
                padding: 2,
                fontSize: "1rem",
              }}
            />
          ))}
        </Box>
        <FormControl
          fullWidth
          margin="normal"
          sx={{ backgroundColor: "#333", color: "#333", borderRadius: "16px" }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            sx={{
              backgroundColor: "#F2EFE7",
              borderRadius: "16px",
              color: "#333",
            }}
          >
            {roles.length > 0
              ? roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))
              : []}
          </Select>
        </FormControl>
        <FormControl component="fieldset" margin="normal">
          <RadioGroup
            row
            value={action}
            onChange={(e) => setAction(e.target.value)}
            sx={{
              backgroundColor: "#F2EFE7",
              color: "#333",
              borderRadius: "16px",
            }}
          >
            <FormControlLabel
              value="add"
              control={<Radio />}
              label="Ajouter"
              disabled={loading}
            />
            <FormControlLabel
              value="remove"
              control={<Radio />}
              label="Retirer"
              disabled={loading}
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Fermer
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          {loading ? "Traitement..." : "Appliquer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main RoleGroupConfig Component
const RoleGroupConfig = () => {
  const [users, setUsers] = useState([]);
  const [addRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { roleNames, info: infoRole } = useRole();

  const { userData, getAllUsers } = useGetUserData();
  const { keycloak, initialized } = useKeycloak();
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    setRoles(roleNames);
  }, [roleNames.length]);
  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (!response) return;
        setUsers(
          response.users.map((user) => ({
            id: user._id,
            firstName: user.firstName,
            familyName: user.familyName,
            roles: user.role ? user.role.map((role) => role.name) : [],
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [keycloak.token, initialized]);

  // Handle adding a new role
  const handleAddRole = (newRole) => {
    if (!roles.includes(newRole)) {
      setRoles((prev) => [...prev, newRole]);
    }
  };

  // Handle deleting a role and updating users
  const handleDeleteRole = (roleToDelete) => {
    setRoles((prev) => prev.filter((r) => r !== roleToDelete));
    setUsers((prevUsers) =>
      prevUsers.map((u) => ({
        ...u,
        roles: u.roles.filter((r) => r !== roleToDelete),
      }))
    );
  };

  // Handle updating a user's roles
  const handleUpdateUser = (user, role, action) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === user.id) {
          if (action === "add") {
            return {
              ...u,
              roles: u.roles.includes(role) ? u.roles : [...u.roles, role],
            };
          } else if (action === "remove") {
            return { ...u, roles: u.roles.filter((r) => r !== role) };
          }
        }
        return u;
      })
    );
  };

  // Animation keyframes style
  const pulseAnimation = {
    "@keyframes pulse": {
      "0%": { boxShadow: "0 0 0 0 rgba(255, 152, 0, 0.7)" },
      "70%": { boxShadow: "0 0 0 10px rgba(255, 152, 0, 0)" },
      "100%": { boxShadow: "0 0 0 0 rgba(255, 152, 0, 0)" },
    },
    animation: "pulse 1.5s infinite",
  };

  return (
    <Box sx={{ padding: 2, margin: "auto" }}>
      {infoRole && (
        <Alert severity={infoRole.type} sx={{ fontSize: "1.2rem", m: 5 }}>
          {infoRole.message}
        </Alert>
      )}
      {/* Roles Section */}
      <Typography variant="h4" component="h1" gutterBottom>
        Roles
      </Typography>

      <Box
        sx={{
          border: "1px solid #1D1616",
          borderRadius: "15px",
          padding: 2,
          m: 2,
          mb: 10,
          width: "95%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto",
            whiteSpace: "nowrap",
            gap: 2,
          }}
        >
          {roleNames.length > 0
            ? roleNames.map((role) => (
                <Tooltip
                  key={role}
                  title={
                    users
                      .filter((user) => user.roles.includes(role))
                      .map((user) => `${user.firstName} ${user.familyName}`)
                      .join(", ") || "Aucun utilisateur"
                  }
                >
                  <Chip label={role} sx={{ fontSize: "1.2rem" }} />
                </Tooltip>
              ))
            : []}
        </Box>
      </Box>

      {/* Buttons Section */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, m: 2 }}>
        <Button
          variant="contained"
          onClick={() => setAddRoleDialogOpen(true)}
          startIcon={<AddCircleOutline />}
        >
          Ajouter role
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--design-color)",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
          onClick={() => setDeleteRoleDialogOpen(true)}
          startIcon={<DeleteOutline />}
        >
          Effacer role
        </Button>
      </Box>

      {/* Users Section */}
      <Typography variant="h4" component="h1" gutterBottom>
        Utilisateurs
      </Typography>

      <Box
        sx={{
          border: "1px solid #1D1616",
          padding: 2,
          borderRadius: "15px",
          m: 2,
          width: "95%",
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {users.map((user) => {
            const hasNoRoles = user.roles.length === 0;
            const needsWarning = hasNoRoles;

            const chipLabel = `${
              user.firstName
            } ${user.familyName.toUpperCase()}`;
            const warningMessage = hasNoRoles
              ? "Cet utilisateur n'a aucun rôle"
              : "Cet utilisateur n'a qu'un seul rôle";

            return (
              <Tooltip key={user.id} title={needsWarning ? warningMessage : ""}>
                {needsWarning ? (
                  <Chip
                    sx={{
                      fontSize: "1.2rem",
                      ...(needsWarning && pulseAnimation),
                    }}
                    label={chipLabel}
                    onClick={() => setSelectedUser(user)}
                    color={
                      hasNoRoles
                        ? "warning"
                        : hasOnlyOneRole
                        ? "default"
                        : "default"
                    }
                  />
                ) : (
                  <Chip
                    sx={{ fontSize: "1.2rem" }}
                    label={chipLabel}
                    onClick={() => setSelectedUser(user)}
                  />
                )}
              </Tooltip>
            );
          })}
        </Box>
      </Box>

      {/* Dialogs */}
      <AddRoleDialog
        open={addRoleDialogOpen}
        onClose={() => setAddRoleDialogOpen(false)}
        onAdd={handleAddRole}
      />
      <DeleteRoleDialog
        open={deleteRoleDialogOpen}
        onClose={() => setDeleteRoleDialogOpen(false)}
        roles={roles}
        onDelete={handleDeleteRole}
      />
      {selectedUser && (
        <UserDialog
          open={true}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
          roles={roles}
          onUpdate={handleUpdateUser}
        />
      )}
    </Box>
  );
};

export default RoleGroupConfig;
