import styles from "@/styles/HomeFilterPanel.module.css";
import { ClientOrOpponentType } from "@/types/case";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState } from "react";

export default function HomeFilterPanel(
  props: Readonly<{
    clients: ClientOrOpponentType[];
    opponents: ClientOrOpponentType[];
    setClientFilter: (uid: string) => void;
    setOpponentFilter: (uid: string) => void;
  }>
) {
  const { clients, opponents, setClientFilter, setOpponentFilter } = props;
  const [clientValue, setClientValue] = useState<string>("");
  const [opponentValue, setOpponentValue] = useState<string>("");

  const onClientSelect = (event: any) => {
    const value = event.target.value;
    setClientValue(value);
    setClientFilter(value);
  };

  const onOpponentSelect = (event: any) => {
    const value = event.target.value;
    setOpponentValue(value);
    setOpponentFilter(value);
  };

  return (
    <div className={styles.container}>
      <FormControl className={styles.formControl}>
        <InputLabel id="client-filter">Klient</InputLabel>
        <Select value={clientValue} onChange={onClientSelect}>
          <MenuItem value={""}>Wszystkie</MenuItem>
          {clients.map((client) => (
            <MenuItem key={client.uid} value={client.uid}>
              {client.displayName}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Klienci</FormHelperText>
      </FormControl>
      <FormControl className={styles.formControl}>
        <InputLabel id="opponent-filter">Przeciwnik</InputLabel>
        <Select value={opponentValue} onChange={onOpponentSelect}>
          <MenuItem value={""}>Wszystkie</MenuItem>
          {opponents.map((opponent) => (
            <MenuItem key={opponent.uid} value={opponent.uid}>
              {opponent.displayName}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Strony przeciwne</FormHelperText>
      </FormControl>
    </div>
  );
}
