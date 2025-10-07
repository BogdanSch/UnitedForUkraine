// import axios from "axios";
import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorAlert, Input } from "../../../components";
import AuthContext from "../../../contexts/AuthContext";
import { useCustomForm } from "../../../hooks";
import {
  NewsUpdateDto,
  CreateNewsUpdateRequestDto,
  PaginatedCampaignsDto,
} from "../../../types";
import {
  API_URL,
  API_IMAGE_PLACEHOLDER_URL,
  DEFAULT_PAGE_INDEX,
  LOAD_MORE_SELECT_VALUE,
} from "../../../variables";
import { fetchAllActiveAndCompletedCampaigns } from "../../../utils/services/campaignService";

const CreateNewsUpdateForm: FC = () => {
  const { user } = useContext(AuthContext);

  const DEFAULT_FORM_DATA: CreateNewsUpdateRequestDto = {
    title: "",
    content: "",
    imageUrl: API_IMAGE_PLACEHOLDER_URL,
    readingTimeInMinutes: 0,
    authorId: user?.id || "",
    campaignId: 0,
  };

  const [formData, setFormData] =
    useState<CreateNewsUpdateRequestDto>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({
    title: "",
    content: "",
    readingTimeInMinutes: "",
  });
  const [requestError, setRequestError] = useState<string>("");

  const [finishedPaginatedCampaigns, setFinishedPaginatedCampaigns] =
    useState<PaginatedCampaignsDto>({
      campaigns: [],
      hasNextPage: false,
      hasPreviousPage: false,
    });
  const [pageIndex, setPageIndex] = useState<number>(DEFAULT_PAGE_INDEX);

  const navigate = useNavigate();
  const { handleChange, handleSelectChange, handleImageChange } =
    useCustomForm(setFormData);

  useEffect(() => {
    fetchAllActiveAndCompletedCampaigns(pageIndex)
      .then((data) => {
        setFinishedPaginatedCampaigns({
          campaigns: finishedPaginatedCampaigns.campaigns.concat(
            data.campaigns
          ),
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage,
        });
      })
      .catch((error) => {
        setRequestError(
          "Failed to load finished campaigns. Please, try again later!"
        );
        console.log(`Error fetching finished campaigns: ${error}`);
      });
  }, [pageIndex]);

  const loadMoreCompletedCampaigns = async (): Promise<void> => {
    if (finishedPaginatedCampaigns.hasNextPage)
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

  const isValid = (): boolean => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (formData.title.length < 10) {
      newErrors.title = "The title must be at least 10 characters long";
    }
    if (formData.title.length > 101) {
      newErrors.title = "The title must be at most 100 characters long";
    }
    if (formData.content.length < 20) {
      newErrors.content = "The description must be at least 20 characters long";
    }
    if (formData.readingTimeInMinutes <= 0) {
      newErrors.readingTimeInMinutes =
        "The reading time must be greater than 0";
    }
    if (formData.readingTimeInMinutes >= 60) {
      newErrors.readingTimeInMinutes =
        "The reading time must be at most 60 minutes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!isValid()) return;

    try {
      const { data } = await protectedAxios.post<NewsUpdateDto>(
        `${API_URL}/newsUpdates`,
        formData
      );

      console.log(data);

      if (!data.id) {
        throw new Error("Campaign creation failed");
      }

      navigate(`/newsUpdates/detail/${data.id}`);
    } catch (error) {
      setRequestError(
        "Failed to create a new campaign. Please, try again later!"
      );
      console.error(`Error creating campaign: ${error}`);
    }
  };

  const handleReset = (): void => {
    setFormData(DEFAULT_FORM_DATA);
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
          News Update Title
        </label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          minLength={10}
          maxLength={100}
          placeholder="News update title"
          isRequired
        />
        {errors.title && <ErrorAlert errorMessage={errors.title} />}
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          News Update Content
        </label>
        <textarea
          rows={5}
          className="form-control"
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          minLength={20}
          placeholder="News update content"
          required
        />
        {errors.content && <ErrorAlert errorMessage={errors.content} />}
      </div>
      <div className="mb-3">
        <label htmlFor="readingTimeInMinutes" className="form-label">
          News Update Reading Time In Minutes
        </label>
        <Input
          type="number"
          id="readingTimeInMinutes"
          name="readingTimeInMinutes"
          value={formData.readingTimeInMinutes}
          onChange={handleChange}
          placeholder="News update reading time"
          min={1}
          max={100}
          isRequired={true}
        />
        {errors.goalAmount && <ErrorAlert errorMessage={errors.goalAmount} />}
      </div>
      <div className="mb-3">
        <label htmlFor="campaignId" className="form-label">
          Select to what campaign this news update belongs
        </label>
        <select
          id="campaignId"
          name="campaignId"
          className="form-select"
          aria-label="Select to what campaign this news update belongs"
          value={formData.campaignId}
          onChange={(e) => handleSelectChange(e, loadMoreCompletedCampaigns)}
        >
          {finishedPaginatedCampaigns.campaigns.map((campaign) => {
            return (
              <option key={campaign.title} value={campaign.id}>
                {campaign.title}
              </option>
            );
          })}
          <option
            id="loadMoreOption"
            value={LOAD_MORE_SELECT_VALUE}
            // onClick={loadMoreCompletedCampaigns}
          >
            Load more
          </option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          News Update Preview Image
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

export default CreateNewsUpdateForm;
