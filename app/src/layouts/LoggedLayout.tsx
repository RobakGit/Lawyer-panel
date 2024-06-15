import HorizontalAppBar from "@/components/appBar/HorizontalAppBar";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

interface Props {
  children: ReactNode;
}

export default function LoggedLayout({ children }: Props) {
  const { data: session, update } = useSession();

  useEffect(() => {
    update();
  }, []);

  return (
    <>
      {session && <HorizontalAppBar session={session} />}
      {children}
    </>
  );
}
