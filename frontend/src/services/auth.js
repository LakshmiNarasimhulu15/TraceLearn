import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const AUTH_BASE = `${API_BASE_URL}/api/accounts`;

export const loginUser = async ({ username, password }) => {
  const response = await axios.post(`${AUTH_BASE}/login/`, {
    username,
    password,
  });

  const { access, refresh } = response.data;

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);

  return response.data;
};

export const registerUser = async ({ username, email, password }) => {
  const response = await axios.post(`${AUTH_BASE}/register/`, {
    username,
    email,
    password,
  });

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("accessToken"));
};