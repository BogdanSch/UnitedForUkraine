import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { convertDate } from "../utils/dateConverter";
import { deleteImageAsync, uploadImageAsync } from "../utils/imageHelper";

function useCustomForm(setFormData: Dispatch<SetStateAction<any>> | null) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (!setFormData) return;
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked } = target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (target instanceof HTMLTextAreaElement) {
      const { name, value } = target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!setFormData) return;
    const target = e.target;

    const { name, value, type } = target;

    if (type !== "date") return;

    const formattedDate: string = convertDate(value); //new Date(value).toISOString().slice(0, 10);

    setFormData((prev: any) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    if (!setFormData) return;
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    previousImageUrl: string,
    setRequestError: React.Dispatch<React.SetStateAction<string>>
  ): Promise<void> => {
    if (!setFormData) return;
    console.log(e.target.files);
    const file = e.target.files?.[0] || null;

    if (file) {
      // setImageFile(file);
      const imageUrl: string = (await uploadImageAsync(file)) || "";

      console.log(imageUrl);
      if (imageUrl.length === 0) {
        setRequestError("Failed to upload the image file.");
        return;
      }

      if (previousImageUrl.length > 0) deleteImageAsync(previousImageUrl);

      setFormData((prev: any) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
    } else {
      setRequestError("Failed to read the image file.");
    }
  };

  return {
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleImageChange,
  };
}

export const handleSelectWithDataTagChange = (
  e: ChangeEvent<HTMLSelectElement>,
  setSelectData: Dispatch<SetStateAction<any>>
): void => {
  const element = e.target;
  const data = element.dataset.value;
  setSelectData(data);
};

export default useCustomForm;
