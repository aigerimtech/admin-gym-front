import React from "react";
import CardBoxModal from "../../CardBox/Modal";
import { useAdminStore, User } from "../../../stores/admin/adminStore"; // Import User interface from adminStore

interface EditUserModalProps {
  isActive: boolean;
  user: User | null;
  onSave: () => void;
  onClose: () => void;
  setUser: (user: User | null) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isActive, user, onSave, onClose, setUser }) => {
  if (!user) return null;

  const handleInputChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <CardBoxModal title="Edit User" buttonColor="info" buttonLabel="Save" isActive={isActive} onConfirm={onSave} onCancel={onClose}>
      <div>
        <input
          className="border p-2 w-full mb-2"
          placeholder="First Name"
          value={user.first_name || ""}
          onChange={(e) => handleInputChange("first_name", e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Last Name"
          value={user.last_name || ""}
          onChange={(e) => handleInputChange("last_name", e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Phone"
          value={user.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={user.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </div>
    </CardBoxModal>
  );
};

export default EditUserModal;
