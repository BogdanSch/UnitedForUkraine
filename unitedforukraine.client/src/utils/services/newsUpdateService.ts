import axios from "axios";
import { NewsUpdateDto } from "../../types";
import { API_URL } from "../../variables";

export const fetchNewsUpdateData = async (
  id: number
): Promise<NewsUpdateDto | null> => {
  try {
    const { data } = await axios.get<NewsUpdateDto>(
      `${API_URL}/newsUpdates/${id}`
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
