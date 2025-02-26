import axios from "axios";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // Use env variable for flexibility
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;