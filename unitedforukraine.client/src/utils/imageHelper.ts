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

export const deleteImageAsync = async (imageUrl: string): Promise<boolean> => {
  const formData = new FormData();
  formData.append("publicUrl", imageUrl);

  try {
    await axios.post(`${API_URL}/Photo/delete`, formData);
    return true;
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
};
