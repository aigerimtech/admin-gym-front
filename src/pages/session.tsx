import React, {useState} from "react";
import SectionMain from "../components/Section/Main";
import {mdiCalendar, mdiPlus} from "@mdi/js";
import {getPageTitle} from "../config";
import Head from "next/head";
import CreateSessionModal from "../components/CardBox/Component/CreateSessionModal";
import SectionTitle from "../components/Section/Title";
import TimeTableClient from "../components/Calendar/TimeTableClient";

const SessionPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Head>
                <title>{getPageTitle('Session Register')}</title>
            </Head>
            <SectionMain>
                <SectionTitle icon={mdiCalendar}>
                    Register to Sessions
                </SectionTitle>
                <TimeTableClient/>
                <CreateSessionModal
                    isActive={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </SectionMain>
        </>
    );
};

export default SessionPage;
