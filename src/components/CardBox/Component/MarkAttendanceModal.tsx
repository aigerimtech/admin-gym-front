import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../../../stores/attendance/attendanceStore";
import CardBoxModal from "../../CardBox/Modal";
import Flatpickr from "react-flatpickr";
import InputWithUserName from "../../inputs/InputWithUserName";
import { User } from "../../../stores/admin/adminStore";


interface MarkAttendanceModalProps {
  isActive: boolean;
  onClose: () => void;
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isActive,
  onClose,
}) => {
      const markAttendance = useAttendanceStore(state => state.markAttendance)
      const [dateAttendance, setDateAttendance] = useState<string>('');
      const [user, setUser] = useState<User[]>([]);
      const handleSave = async () => {
          try {
              await markAttendance(user[0]?.id || 0, dateAttendance);
              onClose();
          } catch (error) {
              console.error("Error creating user:", error);
          }
      };
  
  return ( 
    <CardBoxModal
            title="Mark Attendance"
            buttonColor="info"
            buttonLabel="Save"
            isActive={isActive}
            onConfirm={handleSave}
            onCancel={onClose}
        >
            <div>
                <InputWithUserName selectedPersons={users => {setUser(users)} } />
                <Flatpickr
                    className="border p-2 w-full mb-2"
                    options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                    value={dateAttendance}
                    onChange={([date]) => setDateAttendance(date.toISOString())}
                />
            </div>
        </CardBoxModal>
  );
};

export default MarkAttendanceModal;
