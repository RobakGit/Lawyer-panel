import HorizontalAppBar from "@/components/appBar/HorizontalAppBar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LoggedLayout({ children }: Props) {
  return (
    <>
      <HorizontalAppBar />
      {children}
    </>
  );
}
