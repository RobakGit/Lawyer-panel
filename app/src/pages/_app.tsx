import WindowWrapper from "@/components/window-wrapper";
import LoggedLayout from "@/layouts/LoggedLayout";
import "@/styles/globals.css";
import { Page } from "@/types/page";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

type Props = AppProps & {
  Component: Page;
};

export default function App({ Component, pageProps }: Props) {
  const { session } = pageProps;

  const getLayout =
    Component.getLayout ?? ((page) => <LoggedLayout>{page}</LoggedLayout>);

  return (
    <SessionProvider session={session}>
      <WindowWrapper>{getLayout(<Component {...pageProps} />)}</WindowWrapper>
    </SessionProvider>
  );
}
