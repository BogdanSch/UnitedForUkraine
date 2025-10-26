import axios from "axios";
import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../variables";
import { UpdateCampaignRequestDto } from "../../../types";
import { CampaignCategory, CampaignStatus } from "../../../types/enums";
import { ErrorAlert, Input } from "../../../components/";
import { fetchCampaignData } from "../../../utils/services/campaignService";
import { useCustomForm } from "../../../hooks";

interface EditCampaignFormProps {
  id: number;
}

const EditCampaignForm: FC<EditCampaignFormProps> = ({ id }) => {
  const DEFAULT_FORM_DATA: UpdateCampaignRequestDto = {
    id: id,
    title: "",
    slogan: "",
    description: "",
    goalAmount: 0,
    status: CampaignStatus.Upcoming,
    category: CampaignCategory.Education,
    startDate: "",
    endDate: "",
    imageUrl: "",
  };

  const [formData, setFormData] =
    useState<UpdateCampaignRequestDto>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    slogan: "",
    description: "",
    goalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [requestError, setRequestError] = useState<string>("");
  const navigate = useNavigate();
  const {
    handleChange,
    handleSelectChange,
    handleDateChange,
    handleImageChange,
  } = useCustomForm(setFormData);

  useEffect(() => {
    fetchCampaignData(Number(id))
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

    if (formData.title.length < 10) {
      newErrors.title = "The title must be at least 10 characters long";
    } else if (formData.title.length > 265) {
      newErrors.title = "The title must be at most 265 characters long";
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
    if (new Date(formData.endDate) <= new Date()) {
      newErrors.endDate = "The end date must be in the future";
    } else if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "The end date must be after the start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const response = await protectedAxios.put(
        `${API_URL}/campaigns/${formData.id}`,
        formData
      );
      console.log(response);

      if (response.status !== 204) throw new Error("Campaign updating failed!");

      navigate(`/campaigns/detail/${formData.id}`);
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
    setFormData(DEFAULT_FORM_DATA);
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
          Campaign title
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
          Campaign slogan
        </label>
        <Input
          type="text"
          id="slogan"
          name="slogan"
          value={formData.slogan}
          onChange={handleChange}
          minLength={10}
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
        <label htmlFor="startDate" className="form-label">
          Campaign Start Date
        </label>
        <Input
          type="date"
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

export default EditCampaignForm;
