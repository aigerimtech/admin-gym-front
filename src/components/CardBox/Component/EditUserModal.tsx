"use client";
import React from "react";
import CardBoxModal from "../../CardBox/Modal";

interface EditUserModalProps {
  isActive: boolean;
  user: any;
  onSave: () => void;
  onClose: () => void;
  setUser: (user: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isActive, user, onSave, onClose, setUser }) => {
  if (!user) return null;

  return (
    <CardBoxModal title="Edit User" buttonColor="info" buttonLabel="Save" isActive={isActive} onConfirm={onSave} onCancel={onClose}>
      <div>
        <input
          className="border p-2 w-full mb-2"
          placeholder="First Name"
          value={user.first_name}
          onChange={(e) => setUser({ ...user, first_name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Last Name"
          value={user.last_name}
          onChange={(e) => setUser({ ...user, last_name: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Phone"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>
    </CardBoxModal>
  );
};

export default EditUserModal;
