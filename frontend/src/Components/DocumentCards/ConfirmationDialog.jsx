import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box
} from "@mui/material";

const ConfirmationDialog = ({
  open,
  onClose,
  title,
  content,
  confirmButtonText = "Confirmer",
  cancelButtonText = "Annuler",
  onConfirm,
  confirmButtonColor = "success",
  selectedItem = null,
  selectedItemLabel = "Item",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "#F5EFFF",
          padding: "15px",
          borderRadius: "16px",
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
          {selectedItem && (
            <Box sx={{ mt: 2, fontWeight: "bold" }}>
              {selectedItemLabel}: {selectedItem}
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmButtonColor}
          autoFocus
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;