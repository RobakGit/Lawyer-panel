import { signOut } from "next-auth/react";
import styles from "@/styles/HorizontalAppBar.module.css";
import { Session } from "next-auth";
import { Button } from "@mui/material";

export default function HorizontalAppBar(props: { session: Session }) {
  const { session } = props;

  return (
    <div className={styles.container}>
      <Button
        color="inherit"
        sx={{ background: "#fefe", color: "#000" }}
        variant="contained"
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
      >
        wyloguj
      </Button>
      {session?.user?.email}
    </div>
  );
}
