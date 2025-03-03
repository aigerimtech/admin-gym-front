"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth/authStore";
import { useAdminStore } from "../stores/admin/adminStore";
import { useRouter } from "next/navigation";
import {User} from "../stores/admin/adminStore"

const AdminUsersPage = () => {
  const { fetchUsers, users, deleteUser, updateUser, createUser, fetchUserById } = useAdminStore();
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const { isAuthenticated, isAdmin } = useAuthStore(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchCurrentUser();  
      setLoading(false);  
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (loading) return;  

    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/dashboard");
    } else {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, loading]);  

  if (loading) {
    return <p className="text-center">Loading...</p>;  
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<{ id: number; first_name: string; email: string } | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");

  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",  
    email: "",
    phone: "",
    password: "",
    role: "user",  
    access_level: "client",  
  });

  const handleCreateUser = async () => {
    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.phone || !newUser.password) {
      alert("Please fill in all fields.");
      return;
    }
  
    const userData = { 
      ...newUser, 
      role: "user" as "user", 
      access_level: "client" as "client" 
    };
  
    await createUser(userData);
  
    setNewUser({ first_name: "", last_name: "", email: "", phone: "", password: "", role: "user", access_level: "client" });
  };
  
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
    }
  };

  const handleUpdate = async () => {
    if (editingUser) {
      await updateUser(editingUser.id, { first_name: updatedName, email: updatedEmail });
      setEditingUser(null);
    }
  };

  const handleViewUser = async (id: number) => {
    const user = await fetchUserById(id);
    setSelectedUser(user);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.first_name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button className="text-blue-500 mr-2" onClick={() => handleViewUser(user.id)}>View</button>
                <button className="text-blue-500 mr-2" onClick={() => setEditingUser(user)}>Edit</button>
                <button className="text-red-500" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-6">Create User</h2>
      <input className="border p-2" placeholder="Name" value={newUser.first_name} onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })} />
      <input className="border p-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
      <input className="border p-2" placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
      <button className="bg-green-500 text-white px-4 py-2" onClick={handleCreateUser}>Create</button>

      {selectedUser && <div className="modal">...</div>}
      {editingUser && <div className="modal">...</div>}
    </div>
  );
};

export default AdminUsersPage;
