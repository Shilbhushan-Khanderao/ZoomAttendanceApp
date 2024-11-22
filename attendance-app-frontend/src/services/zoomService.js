const API_URL = "http://localhost:4000/api/zoom"; // Replace with your backend URL

export const fetchMeetings = async () => {
  const response = await fetch(`${API_URL}/meeting`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional if you use token storage
    },
  });
  if (!response.ok) throw new Error("Failed to fetch meetings.");
  return response.json();
};

export const fetchMeetingInstances = async (id) => {
  const response = await fetch(`${API_URL}/instances/:id`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional if you use token storage
    },
  });
  if (!response.ok) throw new Error("Failed to fetch meetings.");
  return response.json();
};

// You can create similar functions for fetching participants, etc.
