import { signOut } from "next-auth/react";

export default function HorizontalAppBar() {
  return (
    <>
      <button
        onClick={() => {
          signOut({ callbackUrl: "/" });
        }}
      >
        wyloguj
      </button>
    </>
  );
}
