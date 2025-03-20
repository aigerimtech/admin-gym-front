import React, {useState} from "react";
import SectionMain from "../components/Section/Main";
import {mdiCalendar, mdiPlus} from "@mdi/js";
import TimeTable from "../components/Calendar/TimeTable";
import {getPageTitle} from "../config";
import Head from "next/head";
import Icon from "@mdi/react";
import SectionTitleLineWithButton from "../components/Section/TitleLineWithButton";
import Modal from "../components/CardBox/Modal";
import Button from "../components/Button";
import CreateSessionModal from "../components/CardBox/Component/CreateSessionModal";

const SessionPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Head>
                <title>{getPageTitle('Sessions')}</title>
            </Head>
            <SectionMain>
                <SectionTitleLineWithButton icon={mdiCalendar} title="Sessions" main>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
                    >
                        <Icon path={mdiPlus} size={0.8}/> Create Session
                    </button>
                </SectionTitleLineWithButton>
                <TimeTable/>
                <CreateSessionModal
                    isActive={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </SectionMain>
        </>
    );
};

export default SessionPage;
