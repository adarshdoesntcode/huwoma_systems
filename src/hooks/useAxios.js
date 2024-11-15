import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const simRacingKey = localStorage.getItem("simRacingKey");
      config.headers.Authorization = simRacingKey
        ? `Bearer ${simRacingKey}`
        : "";
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default useAxios;
