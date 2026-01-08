import axios from "axios";
import { API_URL } from "../../variables";
import { isNullOrWhitespace } from "../helpers/stringHelper";

export const uploadImageAsync = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("imageFile", file);

  try {
    const { data } = await axios.post(`${API_URL}/photos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!data) throw new Error("Image upload failed");
    return data;
  } catch (error) {
    console.error("Error uploading image: " + error);
    return null;
  }
};

export const deleteImageAsync = async (imageUrl: string): Promise<boolean> => {
  try {
    const publicId = imageUrl.split("/").pop()?.split(".")[0];
    if (isNullOrWhitespace(publicId)) throw new Error("Invalid image URL");

    await axios.delete(`${API_URL}/photos/${publicId}`);
    return true;
  } catch (error) {
    console.error("Error while uploading image: " + error);
    return false;
  }
};
