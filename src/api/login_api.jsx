import { API_ROUTER } from "../App";
import axios from "axios";

// Function to handle login
export const handleLogin = async (username, password, next) => {
  try {
    const response = await axios.post(`${API_ROUTER}/login`, {
      username,
      password,
    });
    const { token, user } = response.data;

    // Save token and user to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("Logged in user's organization:", user.position);

    // Pass the user object to the callback
    next(user);
  } catch (err) {
    console.error("Login failed", err.response?.data || err.message);
    throw err;
  }
};

export const handleLogout = () => {
  // Clear authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Redirect to the login page
  navigate("/login");
};
