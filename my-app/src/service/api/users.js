/* eslint-disable no-unused-vars */

import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    // Log the User data being sent for debugging
    console.log("Updating User:", { id, userData });

    // Perform the PUT request to update the User
    const response = await axios.put(`${BASE_URL}/Users/${id}`, userData, {
      headers: { "Content-Type": "application/json" }, // Correct header for JSON data
    });

    // Return the response data
    return response.data;
  } catch (error) {
    // Log and throw the error for proper error handling
    console.error("Failed to update product:", error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/Users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};



export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

