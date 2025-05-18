import axios from "axios";
import { FC, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../contexts/AuthContext";
import { ErrorAlert } from "../../../components";
import { CreateCampaignRequestDto } from "../../../types";
import {
  CampaignCategory,
  CampaignStatus,
  Currency,
} from "../../../types/enums";
import { API_URL, API_IMAGE_PLACEHOLDER_URL } from "../../../variables";
import { useCustomForm } from "../../../hooks";

const CreateCampaignForm: FC = () => {
  const [formData, setFormData] = useState<CreateCampaignRequestDto>({
    title: "",
    description: "",
    goalAmount: 0,
    status: CampaignStatus.Upcoming,
    currency: Currency.UAH,
    category: CampaignCategory.Education,
    startDate: "",
    endDate: "",
    imageUrl: API_IMAGE_PLACEHOLDER_URL,
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [requestError, setRequestError] = useState<string>("");
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const {
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleImageChange,
  } = useCustomForm(setFormData);

  const isValid = (): boolean => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 10) {
      newErrors.title = "The title must be at least 10 characters long";
    }
    if (formData.title.length > 265) {
      newErrors.title = "The title must be at most 265 characters long";
    }
    if (formData.description.length < 20) {
      newErrors.description =
        "The description must be at least 20 characters long";
    }
    if (formData.goalAmount <= 0) {
      newErrors.goalAmount = "The goal amount must be greater than 0";
    }
    if (new Date(formData.startDate) < new Date()) {
      newErrors.startDate = "The start date must be in the future or today";
    }
    if (new Date(formData.endDate) <= new Date()) {
      newErrors.endDate = "The end date must be in the future or today";
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "The end date must be after the start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const { data } = await axios.post(
        `${API_URL}/campaigns/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log(data);

      if (!data.id) {
        throw new Error("Campaign creation failed");
      }

      navigate(`/campaigns/detail/${data.id}`);
    } catch (error) {
      setRequestError("Failed to create campaign. Please try again later!");
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
      category: CampaignCategory.Education,
      startDate: "",
      endDate: "",
      imageUrl: "",
    });
    setErrors({});
  };

  return (
    <form
      className="form campaigns__form"
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
          placeholder="Campaign title"
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
          value={formData.description}
          onChange={handleChange}
          minLength={20}
          placeholder="Campaign description"
          required
        />
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
          placeholder="Campaign goal amount"
          min={0}
          required
        />
        {errors.goalAmount && <ErrorAlert errorMessage={errors.goalAmount} />}
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Campaign Status
        </label>
        <select
          id="status"
          name="status"
          className="form-select"
          aria-label="Campaign status select"
          value={formData.status}
          onChange={handleSelectChange}
        >
          {Object.keys(CampaignStatus)
            .filter((key) => !isNaN(Number(CampaignStatus[key as any])))
            .map((key) => (
              <option
                key={key}
                value={CampaignStatus[key as keyof typeof CampaignStatus]}
              >
                {key}
              </option>
            ))}
          {/* <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option> */}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Campaign Category
        </label>
        <select
          id="category"
          name="category"
          className="form-select"
          aria-label="Campaign category select"
          value={formData.category}
          onChange={handleSelectChange}
        >
          {Object.keys(CampaignCategory)
            .filter((key) => !isNaN(Number(CampaignCategory[key as any])))
            .map((key) => (
              <option
                key={key}
                value={CampaignCategory[key as keyof typeof CampaignCategory]}
              >
                {key}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="currency" className="form-label">
          Campaign Currency
        </label>
        <select
          id="currency"
          name="currency"
          className="form-select"
          aria-label="Campaign currency select"
          value={formData.currency}
          onChange={handleSelectChange}
        >
          {Object.keys(Currency)
            .filter((key) => !isNaN(Number(Currency[key as any])))
            .map((key) => (
              <option key={key} value={Currency[key as keyof typeof Currency]}>
                {key}
              </option>
            ))}
          {/* <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option> */}
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
          onChange={handleDateChange}
          placeholder="Campaign start date"
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
          onChange={handleDateChange}
          placeholder="Campaign end date"
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
          // value={imageFile?.name || ""}
          onChange={(e) =>
            handleImageChange(e, formData.imageUrl, setRequestError)
          }
          accept="image/png, image/jpeg"
          required
        />
      </div>
      <div className="form-buttons">
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
