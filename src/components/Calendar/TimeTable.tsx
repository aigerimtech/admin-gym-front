"use client";

import React, {useEffect, useState} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotMonth} from "@daypilot/daypilot-lite-react";
import {useAdminSessionStore} from "../../stores/sessions/adminSessions";

type ViewType = "Day" | "Week" | "Month";

const colors = [
    {name: "Dark Green", id: "#228b22"},
    {name: "Green", id: "#6aa84f"},
    {name: "Yellow", id: "#f1c232"},
    {name: "Orange", id: "#e69138"},
    {name: "Indian Red", id: "#cd5c5c"},
    {name: "Fire Brick", id: "#b22222"},
    {name: "Purple", id: "#9370db"},
    {name: "Turquoise", id: "#40e0d0"},
    {name: "Light Blue", id: "#add8e6"},
    {name: "Sky Blue", id: "#87ceeb"},
    {name: "Blue", id: "#3d85c6"},
];

const people = [
    {name: "Amélie", id: "Amélie"},
    {name: "Bernhard", id: "Bernhard"},
    {name: "Carlo", id: "Carlo"},
    {name: "Diana", id: "Diana"},
    {name: "Eva", id: "Eva"},
    {name: "Francesco", id: "Francesco"},
    {name: "Lotte", id: "Lotte"},
    {name: "Erik", id: "Erik"},
];

const locations = [
    {name: "Conference Room A", id: "Conference Room A"},
    {name: "Conference Room B", id: "Conference Room B"},
    {name: "HQ - Floor 1", id: "HQ - Floor 1"},
    {name: "HQ - Floor 2", id: "HQ - Floor 2"},
    {name: "Online Meeting", id: "Online Meeting"},
    {name: "Skype Link", id: "Skype Link"},
    {name: "Zoom Link", id: "Zoom Link"},
];

const teams = [
    {name: "Development", id: "Development"},
    {name: "Finance", id: "Finance"},
    {name: "HR", id: "HR"},
    {name: "Legal", id: "Legal"},
    {name: "Marketing", id: "Marketing"},
    {name: "Product", id: "Product"},
    {name: "Sales", id: "Sales"},
];

const TimeTable = () => {
    const fetchSessions = useAdminSessionStore(state => state.fetchSessions)
    const sessions = useAdminSessionStore(state => state.sessions)
    const updateSession = useAdminSessionStore(state => state.updateSession)
    const deleteSession = useAdminSessionStore(state => state.deleteSession)
    const [view, setView] = useState<ViewType>("Week");
    const [startDate] = useState<DayPilot.Date>(DayPilot.Date.today());
    const [events, setEvents] = useState<DayPilot.EventData[]>([]);

    type AnyCalendar = DayPilot.Calendar | DayPilot.Month;

    const [dayView, setDayView] = useState<DayPilot.Calendar>();
    const [weekView, setWeekView] = useState<DayPilot.Calendar>();
    const [monthView, setMonthView] = useState<DayPilot.Month>();

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

    const editEvent = async (e: DayPilot.Event) => {
        const form = [
            {name: "Event text", id: "text", type: "text"},
            {name: "Event color", id: "tags.color", type: "select", options: colors},
            {name: "Trainer", id: "tags.assigned", type: "select", options: people},
            {name: "Location", id: "tags.location", type: "select", options: locations},
            {name: "Team", id: "tags.team", type: "select", options: teams},
            {name: "Capacity", id: "tags.capacity", type: "number"},
            {name: "Available Slots", id: "tags.available_slots", type: "number"}
        ];
        const modal = await DayPilot.Modal.form(form, e.data);
        if (modal.canceled) {
            return;
        }
        const updatedEvent = modal.result;
        setEvents((prevEvents) =>
            prevEvents.map((item) =>
                item.id === e.id()
                    ? updatedEvent
                    : item
            )
        );
    };

    const onEventMoved = async (id: number, data: { start_time: string, end_time: string }) => {
        updateSession(id, data);
    };

    const contextMenu = new DayPilot.Menu({
        items: [
            {
                text: "Delete",
                onClick: async args => {
                    const calendar: AnyCalendar = args.source.calendar;
                    calendar.events.remove(args.source);
                },
            },
            {
                text: "-"
            },
            {
                text: "Edit...",
                onClick: async args => {
                    await editEvent(args.source);
                }
            }
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
                end: new DayPilot.Date(session.end_time).addHours(1),  // Assuming a 1-hour duration
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
                    onEventMoved={async args => onEventMoved(args.e.data.id, {
                        start_time: args.e.data.start.toString(),
                        end_time: args.e.data.end.toString()
                    })}
                    visible={view === "Day"}
                    durationBarVisible={true}
                    contextMenu={contextMenu}
                    onEventClick={async args => editEvent(args.e)}
                    onTimeRangeSelected={onTimeRangeSelected}
                    onBeforeEventRender={onBeforeEventRenderDayWeek}
                    controlRef={setDayView}
                />
                <DayPilotCalendar
                    viewType={"Week"}
                    startDate={startDate}
                    events={events}
                    onEventMoved={async args => onEventMoved(args.e.data.id, {
                        start_time: args.e.data.start.toString(),
                        end_time: args.e.data.end.toString()
                    })}
                    visible={view === "Week"}
                    durationBarVisible={false}
                    contextMenu={contextMenu}
                    onEventClick={async args => editEvent(args.e)}
                    onTimeRangeSelected={onTimeRangeSelected}
                    onBeforeEventRender={onBeforeEventRenderDayWeek}
                    controlRef={setWeekView}
                />
                <DayPilotMonth
                    startDate={startDate}
                    events={events}
                    onEventMoved={async args => onEventMoved(args.e.data.id, {
                        start_time: args.e.data.start.toString(),
                        end_time: args.e.data.end.toString()
                    })}
                    visible={view === "Month"}
                    eventHeight={50}
                    eventBarVisible={false}
                    contextMenu={contextMenu}
                    onEventClick={async args => editEvent(args.e)}
                    onTimeRangeSelected={onTimeRangeSelected}
                    onBeforeEventRender={onBeforeEventRenderMonth}
                    controlRef={setMonthView}
                />
            </div>
        </div>
    );
};

export default TimeTable;
