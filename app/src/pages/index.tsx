import { useSession } from "next-auth/react";
import Router from "next/router";
import { ReactNode, useEffect } from "react";
import { RingLoader } from "react-spinners";
import styles from "@/styles/StartContainer.module.css";
import BlankLayout from "@/layouts/BlankLayout";

function StartContainer() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      Router.push("/home");
    } else {
      Router.push("/login");
    }
  });
  return (
    <div className={styles.container}>
      <RingLoader color="#000" loading={true} size={150} />
    </div>
  );
}

StartContainer.getLayout = (page: ReactNode) => {
  return <BlankLayout>{page}</BlankLayout>;
};

export default StartContainer;
