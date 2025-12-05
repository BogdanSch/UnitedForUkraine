import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { LOAD_MORE_SELECT_VALUE } from "../variables";
import { convertDate } from "../utils/helpers/dateHelper";
import {
  deleteImageAsync,
  uploadImageAsync,
} from "../utils/services/imageService";

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
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      }));
    } else if (target instanceof HTMLTextAreaElement) {
      const { name, value } = target;
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleNestedChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!setFormData) return;
    const { name, value } = e.target;
    const keys = name.split(".");
    const [parent, child] = keys;

    setFormData((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value,
      },
    }));
  };
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!setFormData) return;
    const target = e.target;
    const { name, value, type } = target;
    if (type !== "date") return;

    const formattedDate: string = convertDate(value);
    setFormData((prev: any) => ({
      ...prev,
      [name]: formattedDate,
    }));
  };
  const handleDateChangeWithCallback = (
    e: ChangeEvent<HTMLInputElement>,
    callback: () => void
  ): void => {
    if (!setFormData) return;
    const target = e.target;
    const { name, value, type } = target;
    if (type !== "date") return;

    const formattedDate: string = convertDate(value);
    setFormData((prev: any) => ({
      ...prev,
      [name]: formattedDate,
    }));
    callback();
  };
  const handleSelectChange = (
    e: ChangeEvent<HTMLSelectElement>,
    loadMoreCallback?: () => void
  ): void => {
    if (!setFormData) return;
    const { name, value } = e.target;

    if (value === LOAD_MORE_SELECT_VALUE && loadMoreCallback) {
      loadMoreCallback();
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: Number(value),
    }));
  };
  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    previousImageUrl: string,
    setRequestError: Dispatch<SetStateAction<string>>
  ): Promise<void> => {
    if (!setFormData) return;

    console.log(e.target.files);
    const file = e.target.files?.[0] || null;

    if (file) {
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
    handleNestedChange,
    handleSelectChange,
    handleDateChange,
    handleDateChangeWithCallback,
    handleImageChange,
  };
}

export const handleSimpleSelectChangeWithCallback = (
  e: ChangeEvent<HTMLSelectElement>,
  setFormData: Dispatch<SetStateAction<any>>,
  callback: () => void,
  loadMoreCallback?: () => void,
): void => {
  if (!setFormData) return;
  const { value } = e.target;

  if (value === LOAD_MORE_SELECT_VALUE && loadMoreCallback) {
    loadMoreCallback();
    return;
  }

  setFormData(value);
  callback();
};

export const handleSelectWithDataTagChange = (
  e: ChangeEvent<HTMLSelectElement>,
  setSelectData: Dispatch<SetStateAction<any>>
): void => {
  const select = e.target;

  const selectedOption = select.options[select.selectedIndex];
  const dataValue: string =
    selectedOption.getAttribute("data-value") ?? select.value;

  setSelectData(dataValue);
};

export default useCustomForm;
