export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

  
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch user");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};
