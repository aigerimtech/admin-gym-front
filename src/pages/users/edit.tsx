import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiClient } from "../../stores/api/apiCLient";
import { getToken } from "../../stores/utils/token"; // Token helper

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query; // Get user ID from URL
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found. User is not authenticated.");
          return;
        }

        if (!id) {
          console.error("No user ID provided in the URL.");
          return;
        }

        const res = await apiClient.get(`/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data.name);
        setEmail(res.data.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) {
      console.error("User ID is missing");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Cannot update user.");
        return;
      }

      await apiClient.put(
        `/users/edit/${id}`,
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push("/users"); // Redirect to users list after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      <h1>Edit User</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
