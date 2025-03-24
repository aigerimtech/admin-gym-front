"use client";

import React, {useEffect, useState} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotMonth} from "@daypilot/daypilot-lite-react";
import {useAdminSessionStore} from "../../stores/sessions/adminSessions";
import EditSessionModal from "../CardBox/Component/EditSessionModal";
import { useUserSessionStore } from '../../stores/sessions/UserSessions';
import { useAuthStore } from '../../stores/auth/authStore';

type ViewType = "Day" | "Week" | "Month";

const TimeTableClient = () => {
    const fetchSessions = useAdminSessionStore(state => state.fetchSessions)
    const sessions = useAdminSessionStore(state => state.sessions)
    const currentUser = useAuthStore(state => state.currentUser)
    const postRegistration = useUserSessionStore(state => state.postRegistration)
    
    const [view, setView] = useState<ViewType>("Week");
    const [startDate] = useState<DayPilot.Date>(DayPilot.Date.today());
    const [events, setEvents] = useState<DayPilot.EventData[]>([]);

    const [dayView, setDayView] = useState<DayPilot.Calendar>();
    const [weekView, setWeekView] = useState<DayPilot.Calendar>();
    const [monthView, setMonthView] = useState<DayPilot.Month>();

    const [isModalEdit, setIsModalEdit] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const onTimeRangeSelected = async (args: DayPilot.CalendarTimeRangeSelectedArgs | DayPilot.MonthTimeRangeSelectedArgs) => {
        const calendar = args.control;
        const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
        calendar.clearSelection();
        if (modal.canceled) {
            return;
        }
        const e = {
            id: DayPilot.guid(),
            start: args.start,
            end: args.end,
            text: modal.result
        };
        setEvents(prevEvents => [...prevEvents, e]);
    };

    const onBeforeEventRenderDayWeek = (args: DayPilot.CalendarBeforeEventRenderArgs) => {
        const eventColor = args.data.tags?.color || "#3d85c6";
        args.data.backColor = eventColor + "dd";
        args.data.borderColor = "darker";
        const assignedTo = args.data.tags?.assigned || "Unassigned";
        const location = args.data.tags?.location || "";
        const teamName = args.data.tags?.team || "No Team";
        const capacity = args.data.tags?.capacity || 0;
        const availableSlots = args.data.tags?.available_slots || 0;
        const teamBadgeColor = DayPilot.ColorUtil.darker(eventColor);
        args.data.html = "";
        args.data.areas = [
            {
                id: "title",
                top: 5,
                left: 5,
                right: 50,
                height: 20,
                text: args.data.text,
                fontColor: "#fff",
                style: "font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            },
            {
                id: "assigned",
                top: 25,
                left: 5,
                right: 5,
                height: 18,
                text: `Trainer: ${assignedTo}`,
                fontColor: "#fff",
                style: "font-size: 11px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            },
            {
                id: "slots",
                top: 42,
                left: 5,
                right: 5,
                height: 18,
                text: `Slots: ${availableSlots}/${capacity}`,
                fontColor: "#fff",
                style: "font-size: 11px; opacity: 0.9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            },
            {
                id: "menu",
                top: 5,
                right: 5,
                width: 20,
                height: 20,
                padding: 2,
                symbol: "icons/daypilot.svg#threedots-v",
                fontColor: "#fff",
                backColor: "#00000033",
                borderRadius: "50%",
                style: "cursor: pointer;",
                toolTip: "Show context menu",
                action: "ContextMenu"
            },
            {
                id: "teamBadge",
                bottom: 5,
                left: 5,
                right: 5,
                height: 18,
                borderRadius: "4px",
                backColor: teamBadgeColor,
                fontColor: "#fff",
                text: `Team: ${teamName}`,
                style:
                    "text-align: center; font-size: 11px; line-height: 18px; overflow: hidden; text-overflow: ellipsis; cursor: default;"
            }
        ];
    };

    const onBeforeEventRenderMonth = (args: DayPilot.MonthBeforeEventRenderArgs) => {
        const eventColor = args.data.tags?.color || "#3d85c6";
        args.data.backColor = eventColor + "dd";
        args.data.borderColor = DayPilot.ColorUtil.darker(eventColor);
        const assignedTo = args.data.tags?.assigned || "Unassigned";
        const location = args.data.tags?.location || "";
        const teamName = args.data.tags?.team || "No Team";
        const capacity = args.data.tags?.capacity || 0;
        const availableSlots = args.data.tags?.available_slots || 0;
        args.data.html = "";
        args.data.areas = [
            {
                id: "title",
                top: 5,
                left: 5,
                right: 5,
                height: 16,
                text: args.data.text,
                fontColor: "#fff",
                style: "font-weight: bold; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            },
            {
                id: "assigned",
                bottom: 5,
                left: 5,
                right: 5,
                height: 16,
                borderRadius: "4px",
                backColor: DayPilot.ColorUtil.darker(eventColor),
                fontColor: "#fff",
                text: assignedTo,
                style:
                    "font-size: 10px; text-align: center; line-height: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
            }
        ];
        args.data.toolTip =
            "Title: " + args.data.text + "\n" +
            "Trainer: " + assignedTo + "\n" +
            "Location: " + location + "\n" +
            "Team: " + teamName + "\n" +
            "Capacity: " + capacity + "\n" +
            "Available Slots: " + availableSlots;
    };

    const contextMenu = new DayPilot.Menu({
        items: [
            {
                text: "Register",
                onClick: async args => {
                    postRegistration({ sessionId: args.source.data.id, user: currentUser.id, sessionDate: args.source.data.start });
                },
            },
        ]
    });

    useEffect(() => {
        fetchSessions();
    }, []);


    useEffect(() => {
        if (sessions) {
            // Transform sessions data into DayPilot event format
            const transformedData = sessions.map((session) => ({
                id: session.id,  // Use the session ID
                text: session.name,  // Use the session name as the event text
                start: new DayPilot.Date(session.start_time),  // Convert date_time to DayPilot.Date
                end: new DayPilot.Date(session.end_time),  // Assuming a 1-hour duration
                tags: {
                    color: "#cd5c5c",  // You can assign a color dynamically or use a default
                    assigned: `${session.trainer.first_name} ${session.trainer.last_name}`,  // Use the trainer's name
                    location: "GYM",  // You can add a location if needed
                    team: session.trainer.first_name,  // You can categorize by team or leave it blank
                    capacity: session.capacity,  // Add capacity
                    available_slots: session.available_slots  // Add available slots
                }
            }));
            setEvents(transformedData);  // Set the transformed data as events
        }
    }, [sessions]);

    return (
        <div className={"container"}>
            <div className={"content"}>
                <div className={"toolbar"}>
                    <div className={"toolbar-group"}>
                        <button onClick={() => setView("Day")} className={view === "Day" ? "selected" : ""}>Day</button>
                        <button onClick={() => setView("Week")} className={view === "Week" ? "selected" : ""}>Week
                        </button>
                        <button onClick={() => setView("Month")} className={view === "Month" ? "selected" : ""}>Month
                        </button>
                    </div>
                </div>
                <DayPilotCalendar
                    viewType={"Day"}
                    startDate={startDate}
                    events={events}
                    visible={view === "Day"}
                    eventMoveHandling={'Disabled'}
                    durationBarVisible={false}
                    contextMenu={contextMenu}
                    onBeforeEventRender={onBeforeEventRenderDayWeek}
                    controlRef={setDayView}
                />
                <DayPilotCalendar
                    viewType={"Week"}
                    startDate={startDate}
                    events={events}
                    visible={view === "Week"}
                    durationBarVisible={false}
                    eventMoveHandling={'Disabled'}
                    contextMenu={contextMenu}                   
                    onBeforeEventRender={onBeforeEventRenderDayWeek}
                    controlRef={setWeekView}
                />
                <DayPilotMonth
                    startDate={startDate}
                    events={events}
                    visible={view === "Month"}
                    eventHeight={50}
                    eventBarVisible={false}
                    eventMoveHandling={'Disabled'}
                    contextMenu={contextMenu}
                    onBeforeEventRender={onBeforeEventRenderMonth}
                    controlRef={setMonthView}
                />
            </div>
            {editingId &&
                <EditSessionModal
                    sessionId={editingId}
                    isActive={isModalEdit}
                    onClose={() => {
                        setEditingId(null)
                        setIsModalEdit(false)
                    }}/>}
        </div>
    );
};

export default TimeTableClient;
