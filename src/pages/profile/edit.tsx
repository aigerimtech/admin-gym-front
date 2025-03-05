import { useEffect, useState } from "react";
import { apiClient } from "../../stores/api/apiCLient";
import { useRouter } from "next/router";
import { getToken } from "../../stores/utils/token"; // Import token helper

export default function EditProfile() {
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found. User is not authenticated.");
          return;
        }

        const res = await apiClient.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setId(res.data.id); // Store user ID for editing
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (!id) {
      console.error("User ID is missing");
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        console.error("No token found. Cannot update profile.");
        return;
      }

      await apiClient.put(
        `/users/edit/${id}`, // Correct endpoint for editing
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } } // Attach token
      );

      router.push("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
