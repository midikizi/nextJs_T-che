import axios from "axios";
import { getSession } from "next-auth/react";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    timeout: 1000,
  });
  
  instance.interceptors.request.use(async (config) => {
    const session = await getSession();
    // On vérifie que session est défini et que accessToken existe
  const token = session && typeof session === "object" && "accessToken" in session
    ? (session as { accessToken?: string }).accessToken
    : undefined;
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
  
  export default instance