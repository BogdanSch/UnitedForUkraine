import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomForm } from "../../../hooks";
import { ErrorAlert, Input } from "../../../components";
import { CampaignDto, CreateCampaignRequestDto } from "../../../types";
import {
  CampaignCategory,
  CampaignStatus,
  Currency,
} from "../../../types/enums";
import { API_URL, API_IMAGE_PLACEHOLDER_URL } from "../../../variables";

const getDefaultData = (): CreateCampaignRequestDto => ({
  title: "",
  slogan: "",
  description: "",
  goalAmount: 0,
  status: CampaignStatus.Upcoming,
  currency: Currency.UAH,
  category: CampaignCategory.Education,
  startDate: "",
  endDate: "",
  imageUrl: API_IMAGE_PLACEHOLDER_URL,
});

const CreateCampaignForm: FC = () => {
  const [formData, setFormData] = useState<CreateCampaignRequestDto>(
    getDefaultData()
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");
  const navigate = useNavigate();
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
    } else if (formData.title.length > 255) {
      newErrors.title = "The title must be at most 255 characters long";
    }
    if (formData.slogan.length > 60) {
      newErrors.slogan = "The slogan must be at most 60 characters long";
    }
    if (formData.description.length < 20) {
      newErrors.description =
        "The description must be at least 20 characters long";
    }
    if (formData.goalAmount <= 0) {
      newErrors.goalAmount = "The goal amount must be greater than 0";
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "The end date must be after the start date";
    } else if (new Date(formData.endDate) <= new Date()) {
      newErrors.endDate = "The end date must be in the future or today";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const { data } = await protectedAxios.post<CampaignDto>(
        `${API_URL}/campaigns`,
        formData
      );
      console.log(data);

      if (!data.id) throw new Error("Invalid response from server");

      navigate(`/campaigns/detail/${data.id}`);
    } catch (error) {
      setRequestError(
        "Failed to create a new campaign. Please, try again later!"
      );
      console.error(`Error creating campaign: ${error}`);
    }
  };

  const handleReset = (): void => {
    setFormData(getDefaultData());
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
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          minLength={10}
          placeholder="Campaign title"
          isRequired={true}
        />
        {errors.title && <ErrorAlert errorMessage={errors.title} />}
      </div>
      <div className="mb-3">
        <label htmlFor="slogan" className="form-label">
          Campaign Slogan
        </label>
        <Input
          type="text"
          className="form-control"
          id="slogan"
          name="slogan"
          value={formData.slogan}
          onChange={handleChange}
          placeholder="Campaign slogan"
          isRequired={true}
        />
        {errors.slogan && <ErrorAlert errorMessage={errors.slogan} />}
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
        <Input
          type="number"
          className="form-control"
          id="goalAmount"
          name="goalAmount"
          value={formData.goalAmount}
          onChange={handleChange}
          placeholder="Campaign goal amount"
          min={0}
          isRequired={true}
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
        <Input
          type="date"
          className="form-control"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleDateChange}
          placeholder="Campaign start date"
          isRequired={true}
        />
        {errors.startDate && <ErrorAlert errorMessage={errors.startDate} />}
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">
          Campaign End Date
        </label>
        <Input
          type="date"
          className="form-control"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleDateChange}
          placeholder="Campaign end date"
          isRequired={true}
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
