import axios from "axios";
const BASE_URL = "http://localhost:3000/api";

// Fetch all districts
export const fetchDistricts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/districts`);
    return response.data; // Expecting array of districts with cityId in the response
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

// Fetch a district by its ID (also fetching its associated cityId)
export const fetchDistrictsById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/districts/${id}`);
    return response.data; // Expecting district object with cityId in the response
  } catch (error) {
    console.error(`Error fetching district with ID ${id}:`, error);
    throw error;
  }
};

// Update a district by its ID (including cityId)
export const updateDistricts = async (id, districtData) => {
  try {
    console.log("Updating district:", { id, districtData });

    // districtData should include name and cityId
    const response = await axios.put(
      `${BASE_URL}/districts/${id}`,
      districtData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to update district with ID ${id}:`, error);
    throw error;
  }
};

// Delete a district by its ID
export const deleteDistricts = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/districts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting district with ID ${id}:`, error);
    throw error;
  }
};

// Add a new district with related cityId
export const addDistricts = async (districtData) => {
  try {
    // Ensure districtData includes the `cityId` field to associate the district with a city
    const response = await axios.post(`${BASE_URL}/districts`, districtData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new district:", error);
    throw error;
  }
};
