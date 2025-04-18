import axios from "axios";
import { API_URL } from "../variables";

export const uploadImageAsync = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("imageFile", file);

  try {
    const { data } = await axios.post(`${API_URL}/Photo/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log(response);
    if (!data) throw new Error("Image upload failed");
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
