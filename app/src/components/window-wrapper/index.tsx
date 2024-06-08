import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";

interface Props {
  children: ReactNode;
}

export default function WindowWrapper({ children }: Props) {
  const [windowReadyFlag, setWindowReadyFlag] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (typeof window !== "undefined") {
      setWindowReadyFlag(true);
    }
  }, [router.route, router.isReady]);

  if (windowReadyFlag) {
    return <>{children}</>;
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <RingLoader color="#000" loading={true} size={150} />
      </div>
    );
  }
}
