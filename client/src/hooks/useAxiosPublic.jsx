import React from "react";
import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://foodie-backend-78wt.onrender.com",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
