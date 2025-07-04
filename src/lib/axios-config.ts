import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.anonymouspc.net",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for cross-site requests
});

export default instance;