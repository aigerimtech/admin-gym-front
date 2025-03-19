import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import BookingModal from "../components/CardBox/Component/BookSessionModal";
import SectionMain from "../components/Section/Main";
import SectionTitle from "../components/Section/Title";
import CardBox from "../components/CardBox";
import {mdiCalendar} from "@mdi/js";
import TimeTable from "../components/Calendar/TimeTable";

const SessionPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  return (
    <SectionMain>
      <SectionTitle icon={mdiCalendar}>Sessions</SectionTitle>

      {/*<CardBox className="mt-6">*/}
      {/*  <div className="flex flex-col items-center p-6">*/}
      {/*    <div className="flex items-center justify-between w-full max-w-lg mb-4">*/}
      {/*      <button onClick={prevMonth} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">*/}
      {/*        ← Previous*/}
      {/*      </button>*/}
      {/*      <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>*/}
      {/*      <button onClick={nextMonth} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">*/}
      {/*        Next →*/}
      {/*      </button>*/}
      {/*    </div>*/}

      {/*    <div className="grid grid-cols-7 gap-2 mb-6">*/}
      {/*      {daysInMonth.map((day) => (*/}
      {/*        <button*/}
      {/*          key={day.toString()}*/}
      {/*          onClick={() => handleDateClick(day)} */}
      {/*          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-blue-300"*/}
      {/*        >*/}
      {/*          {format(day, "d")}*/}
      {/*        </button>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</CardBox>*/}

      {/*{selectedDate && (*/}
      {/*  <BookingModal*/}
      {/*    isOpen={isModalOpen} */}
      {/*    onClose={handleCloseModal} */}
      {/*    selectedDate={selectedDate} */}
      {/*  />*/}
      {/*)}*/}

    <TimeTable/>
    </SectionMain>
  );
};

export default SessionPage;
