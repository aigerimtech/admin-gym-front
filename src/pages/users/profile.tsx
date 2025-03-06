// Page to show the logged-in user's profile
import { useEffect, useState } from "react";
import {apiClient} from "../../stores/api/apiCLient";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiClient.get("/users/profile").then((res) => setUser(res.data));
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      {user ? ( 
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
