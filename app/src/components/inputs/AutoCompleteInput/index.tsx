import styles from "@/styles/AutoCompleteInput.module.css";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import { useState } from "react";

export default function AutoCompleteInput(props: {
  label: string;
  value: string | null;
  options: Array<{ uid: string; displayName: string }>;
  selectOption: (uid: string) => void;
  createNewOption: (data: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    other: string;
  }) => Promise<string>;
}) {
  const {
    label,
    value: AutoCompleteValue,
    options,
    selectOption,
    createNewOption,
  } = props;
  const newOption = { uid: "new", displayName: `Nowy ${label}` };
  const [acValue, setAcValue] = useState(AutoCompleteValue);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [other, setOther] = useState("");

  const onSelect = (_event: any, value: any) => {
    if (!value) return;
    if (value.uid === "new") {
      setIsDialogOpen(true);
    } else {
      selectOption(value.uid);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFirstName("");
    setLastName("");
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setOther("");
  };

  const createNew = async () => {
    if (name || (firstName && lastName)) {
      const uid = await createNewOption({
        firstName,
        lastName,
        name,
        email,
        phone,
        address,
        other,
      });
      selectOption(uid);
      setAcValue(uid);
      closeDialog();
    } else {
      alert("Nowy wpis musi zawierać przynajmniej IMIĘ i NAZWISKO lub NAZWĘ.");
    }
  };

  return (
    <div className={styles.container}>
      <Autocomplete
        className={styles.autocomplete}
        value={options.find((option) => option.uid === acValue) ?? null}
        options={[newOption, ...options]}
        freeSolo
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.displayName
        }
        renderInput={(params) => (
          <TextField variant="standard" {...params} label={label} />
        )}
        onChange={onSelect}
      />
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>{newOption.displayName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nowy wpis musi zawierać przynajmniej IMIĘ i NAZWISKO lub NAZWĘ. Po
            utworzeniu nowego wpisu będzie on dostępny na liście po NAZWIE lub
            IMIENIU i NAZWISKU.
          </DialogContentText>
          <TextField
            fullWidth
            label="Imię"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Nazwisko"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Nazwa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            fullWidth
            label="Adres"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextareaAutosize
            style={{ width: "99%" }}
            minRows={5}
            placeholder="Inne"
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Anuluj</Button>
          <Button onClick={createNew}>Dodaj</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
