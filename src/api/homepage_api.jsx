import axios from "axios";
import { API_ROUTER } from "../App";

export async function StoreImage() {
  try {
    const response = await axios.get(`${API_ROUTER}/get-all-images`);

    // Assuming response.data contains the images, store them as a JSON string in localStorage
    const imageString = JSON.stringify(response.data);

    if (imageString) {
      // Parse the JSON object stored in localStorage
      const parsedData = JSON.parse(imageString);
      const imagePaths = parsedData.files || [];

      const convertedPaths = imagePaths.map((filePath) => {
        // Convert Windows backslashes to forward slashes
        const normalizedPath = filePath.replace(/\\/g, "/");
        // Split based on '/public/' to get the relative part
        const parts = normalizedPath.split("/public/");
        if (parts.length > 1) {
          // Return the URL starting from the public folder
          return "/" + parts[1];
        }
        // If '/public/' not found, return the normalized path
        return normalizedPath;
      });
      localStorage.setItem("photos", JSON.stringify(convertedPaths));
    }
  } catch (error) {
    console.error("Error retrieving images:", error);
  }
}
