import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export const analyzeJournal = async (text, userId) => {
  try {
    const response = await API.post("/journal/analyze", { text, userId });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const fetchJournalHistory = async (userId) => {
  try {
    const response = await API.get(`/journal/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error("History fetch error:", error);
    return [];
  }
};