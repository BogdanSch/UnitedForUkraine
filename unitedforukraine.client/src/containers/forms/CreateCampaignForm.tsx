import axios from "axios";
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { ErrorAlert } from "../../components/";
import {
  CampaignStatus,
  CreateCampaignRequestDto,
  Currency,
} from "../../types";
import { uploadImageAsync } from "../../utils/imageUploader";
import { API_URL } from "../../variables";
import { useNavigate } from "react-router-dom";

const CreateCampaignForm: FC = () => {
  const [formData, setFormData] = useState<CreateCampaignRequestDto>({
    title: "",
    description: "",
    goalAmount: 0,
    status: CampaignStatus.Upcoming,
    currency: Currency.UAH,
    startDate: "",
    endDate: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
  });

  const [requestError, setRequestError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const isValid = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 10) {
      newErrors.title = "The title must be at least 10 characters long";
    }
    if (formData.description.length < 40) {
      newErrors.title = "The description must be at least 40 characters long";
    }
    if (formData.goalAmount <= 0) {
      newErrors.goalAmount = "The goal amount must be greater than 0";
    }
    if(formData.startDate <= new Date())
      newErrors.startDate = "The start date must be in the future or today";
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (!isValid()) {
      e.preventDefault();
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/Campaign/create`, formData);

      if (data.id) {
        navigate(`/campaigns/detail/${data.id}`);
      }
      throw new Error("Campaign creation failed");
    } catch (error) {
      setRequestError("Failed to create campaign. Please try again later.");
      console.error("Error creating campaign:", error);
    }
  };

  const handleReset = (): void => {
    setFormData({
      title: "",
      description: "",
      goalAmount: 0,
      status: CampaignStatus.Upcoming,
      currency: Currency.UAH,
      startDate: "",
      endDate: "",
      imageUrl: "",
    });
    setErrors({});
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (e.target instanceof HTMLInputElement) {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (e.target instanceof HTMLTextAreaElement) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    console.log(e.target.files);
    const file = e.target.files?.[0] || null;

    if (file) {
      setImageFile(file);
      const imageUrl: string = (await uploadImageAsync(file)) || "";

      setFormData((prev) => ({
        ...prev,
        imageUrl: imageUrl,
      }));
    }
  };

  return (
    <form
      className="campaigns__form"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {requestError.length > 0 && <ErrorAlert errorMessage={requestError} />}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Campaign Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          minLength={10}
          required
        />
        {errors.title && <ErrorAlert errorMessage={errors.title} />}
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Campaign Description
        </label>
        <textarea
          rows={5}
          className="form-control"
          id="description"
          name="description"
          onChange={handleChange}
          minLength={40}
          required
        >
          {formData.description}
        </textarea>
        {errors.description && <ErrorAlert errorMessage={errors.description} />}
      </div>
      <div className="mb-3">
        <label htmlFor="goalAmount" className="form-label">
          Campaign Goal Amount
        </label>
        <input
          type="number"
          className="form-control"
          id="goalAmount"
          name="goalAmount"
          value={formData.goalAmount}
          onChange={handleChange}
          required
        />
        {errors.goalAmount && <ErrorAlert errorMessage={errors.goalAmount} />}
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Campaign Status
        </label>
        <select className="form-select" aria-label="Default select example">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="currency" className="form-label">
          Campaign Currency
        </label>
        <select className="form-select" aria-label="Default select example">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">
          Campaign Start Date
        </label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        {errors.startDate && <ErrorAlert errorMessage={errors.startDate} />}
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">
          Campaign End Date
        </label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
        {errors.endDate && <ErrorAlert errorMessage={errors.endDate} />}
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          Campaign Image
        </label>
        <input
          className="form-control"
          type="file"
          id="image"
          name="image"
          value={imageFile?.name || ""}
          onChange={handleImageChange}
          required
        />
      </div>
      <div className="campaigns__form-buttons">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
    </form>
  );
};

export default CreateCampaignForm;
