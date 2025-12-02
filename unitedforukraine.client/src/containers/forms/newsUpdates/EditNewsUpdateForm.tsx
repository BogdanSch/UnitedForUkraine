import axios from "axios";
import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomForm } from "../../../hooks";
import { API_URL } from "../../../variables";
import { UpdateNewsUpdateRequestDto } from "../../../types";
import { fetchNewsUpdateData } from "../../../utils/services/newsUpdateService";
import { ErrorAlert, Input } from "../../../components";

interface IEditNewsUpdateFormProps {
  id: number;
}

const getDefaultFormData = (id: number): UpdateNewsUpdateRequestDto => ({
  id: id,
  title: "",
  keyWords: "",
  content: "",
  readingTimeInMinutes: 0,
  imageUrl: "",
});

const EditNewsUpdateForm: FC<IEditNewsUpdateFormProps> = ({ id }) => {
  const [formData, setFormData] = useState<UpdateNewsUpdateRequestDto>(
    getDefaultFormData(id)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");
  const navigate = useNavigate();
  const { handleChange, handleImageChange } = useCustomForm(setFormData);

  useEffect(() => {
    fetchNewsUpdateData(id)
      .then((data) => {
        if (!data) throw new Error("Invalid response from server");
        setFormData(data);
      })
      .catch(() => {
        navigate("/notFound");
      });
  }, [id, navigate]);

  const isValid = (): boolean => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 10 || formData.title.length > 255) {
      newErrors.title = "The title must be between 10 and 255 characters long";
    }
    if (formData.keyWords.length < 10 || formData.keyWords.length > 180) {
      newErrors.title =
        "The key words must be between 10 and 180 characters long";
    }
    if (formData.content.length < 20) {
      newErrors.content = "The content must be at least 20 characters long";
    }
    if (
      formData.readingTimeInMinutes <= 0 ||
      formData.readingTimeInMinutes >= 60
    ) {
      newErrors.readingTimeInMinutes =
        "The reading time must be between 0 and 60 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const response = await protectedAxios.put(
        `${API_URL}/newsUpdates/${formData.id}`,
        formData
      );
      console.log(response);
      if (response.status !== 204)
        throw new Error("News update updating failed!");

      navigate(`/newsUpdates/detail/${formData.id}`, {
        state: {
          message: "Campaign was updated successfully.",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRequestError(
          error.response?.data.message ||
            "Failed to update the campaign. Please try again later!"
        );
      } else {
        console.error(`Error updating campaign: ${error}`);
      }
    }
  };

  const handleReset = (): void => {
    setFormData(getDefaultFormData(id));
    setErrors({});
  };

  return (
    <form
      className="form news__form"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {requestError.length > 0 && <ErrorAlert errorMessage={requestError} />}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          News update title
        </label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          minLength={10}
          placeholder="News update title"
          isRequired={true}
        />
        {errors.title && <ErrorAlert errorMessage={errors.title} />}
      </div>
      <div className="mb-3">
        <label htmlFor="keyWords" className="form-label">
          News update key words
        </label>
        <Input
          type="text"
          id="keyWords"
          name="keyWords"
          value={formData.keyWords}
          onChange={handleChange}
          placeholder="Enter key words, separate them with a comma:"
          isRequired={true}
        />
        {errors.keyWords && <ErrorAlert errorMessage={errors.keyWords} />}
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          News update content
        </label>
        <textarea
          rows={8}
          className="form-control"
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Enter news update content"
          required
        />
        {errors.content && <ErrorAlert errorMessage={errors.content} />}
      </div>
      <div className="mb-3">
        <label htmlFor="readingTimeInMinutes" className="form-label">
          News update reading time in minutes
        </label>
        <Input
          type="number"
          id="readingTimeInMinutes"
          name="readingTimeInMinutes"
          value={formData.readingTimeInMinutes}
          onChange={handleChange}
          placeholder="Enter news update reading time in minutes"
          min={1}
          max={100}
          isRequired={true}
        />
        {errors.readingTimeInMinutes && (
          <ErrorAlert errorMessage={errors.readingTimeInMinutes} />
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          News update preview image
        </label>
        <input
          className="form-control"
          type="file"
          id="image"
          name="image"
          onChange={(e) =>
            handleImageChange(e, formData.imageUrl, setRequestError)
          }
          accept="image/png, image/jpeg"
        />
      </div>
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
    </form>
  );
};
export default EditNewsUpdateForm;
