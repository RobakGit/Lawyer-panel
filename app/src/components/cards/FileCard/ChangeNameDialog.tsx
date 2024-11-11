import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  filename: string;
  changeName: (filename: string) => void;
}

export default function ChangeNameDialog({
  open,
  onClose,
  filename,
  changeName,
}: Props) {
  const [value, setValue] = useState(filename);

  const onConfirm = () => {
    onClose();
    changeName(value);
  };

  const handleClose = () => {
    onClose();
    setValue(filename);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Zmień nazwę</DialogTitle>
      <DialogContent>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ width: "100%" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Anuluj</Button>
        <Button variant="contained" onClick={onConfirm}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
