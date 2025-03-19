import React, {useEffect, useState} from "react";
import Script from "next/script";
import type {AppProps} from "next/app";
import type {ReactElement, ReactNode} from "react";
import type {NextPage} from "next";
import Head from "next/head";
import {Provider} from "react-redux";
import {store} from "../stores/store";
import "../css/main.css";
import LayoutAuthenticated from "../layouts/Authenticated";
import {useAuthStore} from "../stores/auth/authStore";
import {useRouter} from "next/router";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({Component, pageProps}: AppPropsWithLayout) {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser)
    const [hydrated, setHydrated] = useState(false);

    const authRoutes = ["/auth/login", "/auth/register"];
    const isAuthPage = authRoutes.includes(router.pathname);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated && !token && !isAuthPage) {
            router.replace("/auth/login");
        }
        if(token){
          fetchCurrentUser()
        }
    }, [hydrated, token, isAuthPage, router]);

    if (!hydrated) return null;


    return (
        <Provider store={store}>
            <>
                <Script src="https://www.googletagmanager.com/gtag/js?id=UA-130795909-1" strategy="afterInteractive"/>
                {token && !isAuthPage ? (
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
