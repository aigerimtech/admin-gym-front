import React, { useState } from "react";
import CardBoxModal from "../../CardBox/Modal";
import Flatpickr from "react-flatpickr";
import {useAdminSessionStore} from "../../../stores/sessions/adminSessions";

interface CreateUserModalProps {
    isActive: boolean;
    onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isActive, onClose }) => {
    const createSession = useAdminSessionStore(state => state.createSession)
    const [formData, setFormData] = useState({
        name: "",
        trainer: "",
        start_time: "",
        end_time: "",
        capacity: "",
        available_slots: "",
    });

    const handleSave = async () => {
        try {
            await createSession({
                name: formData.name,
                trainer: parseInt(formData.trainer, 10),  // Convert to number
                start_time: new Date(formData.start_time).toISOString(),  // Convert to timestamp
                end_time: new Date(formData.end_time).toISOString(),  // Convert to ISO string
                capacity: parseInt(formData.capacity, 10),  // Convert to number
                available_slots: parseInt(formData.available_slots, 10),  // Convert to number
            });
            onClose();
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <CardBoxModal
            title="Create User"
            buttonColor="info"
            buttonLabel="Save"
            isActive={isActive}
            onConfirm={handleSave}
            onCancel={onClose}
        >
            <div>
                <input
                    className="border p-2 w-full mb-2"
                    placeholder="Enter session name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <input
                    className="border p-2 w-full mb-2"
                    name="trainer"
                    value={formData.trainer}
                    onChange={handleInputChange}
                    placeholder="Enter trainer ID"
                />
                <Flatpickr
                    className="border p-2 w-full mb-2"
                    options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                    value={formData.start_time}
                    onChange={([date]) => setFormData(prev => ({ ...prev, start_time: date.toISOString() }))}
                />
                <Flatpickr
                    className="border p-2 w-full mb-2"
                    options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
                    value={formData.end_time}
                    onChange={([date]) => setFormData(prev => ({ ...prev, end_time: date.toISOString() }))}/>
                <input
                    className="border p-2 w-full mb-2"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Enter capacity"
                    type="number"
                />
                <input
                    className="border p-2 w-full mb-2"
                    name="available_slots"
                    value={formData.available_slots}
                    onChange={handleInputChange}
                    placeholder="Enter available slots"
                    type="number"
                />
            </div>
        </CardBoxModal>
    );
};

export default CreateUserModal;
