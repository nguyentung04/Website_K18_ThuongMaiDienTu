
import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

// Fetch all cities
export const fetchCities = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/cities`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
    throw error;
  }
};

// Fetch a city by its ID
export const fetchCitiesById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/cities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching city with ID ${id}:`, error);
    throw error;
  }
}; 
// show Quận /Huyện theo ID tỉnh
export const fetchCitiesByDistricts = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/citydistricts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching city with ID ${id}:`, error);
    throw error;
  }
};
// Update a city by its ID
export const updateCities = async (id, cityData) => {
  try {
    console.log("Updating city:", { id, cityData });

    const response = await axios.put(`${BASE_URL}/cities/${id}`, cityData, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    console.error(`Failed to update city with ID ${id}:`, error);
    throw error;
  }
};

// Delete a city by its ID
export const deleteCities = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/cities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting city with ID ${id}:`, error);
    throw error;
  }
};

// Add a new city
export const addCities = async (cityData) => {
  try {
    const response = await axios.post(`${BASE_URL}/cities`, cityData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new city:", error);
    throw error;
  }
};
