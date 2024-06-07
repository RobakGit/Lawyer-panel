import { Button, Grid, Input } from "@mui/material";
import styles from "@/styles/Login.module.css";
import { ReactNode, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import BlankLayout from "@/layouts/BlankLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/home");
    }
  }, [sessionStatus, router]);

  const onLogin = () => {
    signIn("email", { email: email });
  };
  return (
    <Grid container className={styles.main}>
      <Grid
        item
        container
        xs={12}
        sm={6}
        md={4}
        gap={3}
        className={styles.pane}
        direction="column"
      >
        <Grid item>
          <Input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            className={styles.button}
            variant="contained"
            onClick={onLogin}
          >
            Zaloguj
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

Login.getLayout = (page: ReactNode) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export default Login;
