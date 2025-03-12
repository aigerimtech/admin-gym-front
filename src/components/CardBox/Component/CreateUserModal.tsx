"use client";
import React, { useState } from "react";
import CardBoxModal from "../../CardBox/Modal";

interface CreateUserModalProps {
  isActive: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isActive, onClose }) => {
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });

  const handleSave = async () => {
    // Implement user creation logic here (e.g., call an API to create a user)
    console.log("Creating user:", newUser);
    onClose();
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
          placeholder="First Name"
          value={newUser.first_name}
          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Last Name"
          value={newUser.last_name}
          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Phone"
          value={newUser.phone}
          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </div>
    </CardBoxModal>
  );
};

export default CreateUserModal;
