import { Alert, AlertTitle } from "@mui/material";
import { AxiosError } from "axios";
import { useEffect } from "react";

export interface AlertData {
  type: "info" | "error" | "warning" | "success";
  title: string;
  message: string;
}

interface Props extends AlertData {
  onClose: () => void;
}

export function alertOnCatchRequest(
  error: AxiosError<{ message: string }>,
  stateSetter: (alert: AlertData) => void
) {
  stateSetter({
    type: "error",
    title: error.response?.statusText ?? "Błąd",
    message: error.response?.data.message ?? "Nieznany błąd",
  });
}

export default function CustomAlert({ onClose, type, title, message }: Props) {
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 3000);
  }, []);

  return (
    <Alert
      severity={type}
      sx={{ position: "fixed", bottom: 10, right: 10 }}
      onClose={onClose}
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}
