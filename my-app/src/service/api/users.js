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
    const response = await axios.put(`${BASE_URL}/Users/${id}`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
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

export const updatePassword = (userId, passwords) => {
  axios.put(`http://localhost:3000/api/users/${userId}/password`, passwords, {
    headers: { "Content-Type": "application/json" },
  })
  .then(response => {
    console.log('Password updated successfully:', response.data);
  })
  .catch(error => {
    console.error('Failed to update password:', error.response.data);
  });
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error.response?.data || { message: "Unknown error occurred" };
  }
};

<<<<<<< HEAD
=======

>>>>>>> 01280a7c640a109e33f29b590fe7f02775030ba3
