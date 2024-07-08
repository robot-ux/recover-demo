import type { AppProps } from "next/app";
import { ClientContextProvider } from "../components/walletconnect/ClientContext";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ClientContextProvider>
        <Component {...pageProps} />
      </ClientContextProvider>
    </>
  );
}

export default MyApp;
