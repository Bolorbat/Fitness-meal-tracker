import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://platform.fatsecret.com/rest/foods",
  headers: {
    Authorization: `Bearer ${process.env.FATSECRET_API_KEY}`,
    "Content-Type": "application/json",
  },
});
