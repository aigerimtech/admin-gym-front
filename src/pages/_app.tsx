import React, {useEffect, useState} from "react";
import Script from "next/script";
import type {AppProps} from "next/app";
import type {ReactElement, ReactNode} from "react";
import type {NextPage} from "next";
import {Provider} from "react-redux";
import {store} from "../stores/store";
import "../css/main.css";
import "../components/Calendar/Calendar.css";
import "flatpickr/dist/flatpickr.min.css";
import LayoutAuthenticated from "../layouts/Authenticated";
import {useAuthStore} from "../stores/auth/authStore";
import {useRouter} from "next/router";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import MarkAttendanceModal from "../components/CardBox/Component/MarkAttendanceModal";

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
    const [attendanceModalActive, setAttendanceModalActive] = useState(false);

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
                        <div className="fixed bottom-4 right-4">
                            <button
                                onClick={() => {
                                    setAttendanceModalActive(true);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
                            >
                                <Icon path={mdiPlus} size={0.8}/> Mark Attendance
                            </button>
                        </div>

                        <MarkAttendanceModal
                            isActive={attendanceModalActive}
                            onClose={() => setAttendanceModalActive(false)}
                        />
                    </LayoutAuthenticated>
                ) : (
                    <Component {...pageProps} />
                )}
            </>
        </Provider>
    );
}

export default MyApp;
