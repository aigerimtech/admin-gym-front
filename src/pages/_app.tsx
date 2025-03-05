import React, { useEffect, useState } from "react";
import Script from "next/script";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { store } from "../stores/store";
import { Provider } from "react-redux";
import "../css/main.css";
import LayoutAuthenticated from "../layouts/Authenticated";
import { useAuthStore } from "../stores/auth/authStore";
import { useRouter } from "next/router";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [hydrated, setHydrated] = useState(false);

  // Ensure the app is hydrated before rendering
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !token) {
      router.push("/auth/login");
    }
  }, [hydrated, token]);

  if (!hydrated) return null; // Prevents hydration mismatches

  return (
    <Provider store={store}>
      <>
        <Script src="https://www.googletagmanager.com/gtag/js?id=UA-130795909-1" strategy="afterInteractive" />

        {token ? (
          <LayoutAuthenticated>
            <Component {...pageProps} />
          </LayoutAuthenticated>
        ) : (
          <Component {...pageProps} />
        )}
      </>
    </Provider>
  );
}

export default MyApp;