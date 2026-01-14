import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent, useContext, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
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
import { isNullOrWhitespace } from "../../../utils/helpers/stringHelper";

const API_ENDPOINT: string = import.meta.env.VITE_TINYMCE_API_KEY;

const getDefaultFormData = (authorId: string): CreateNewsUpdateRequestDto => ({
  title: "",
  keyWords: "",
  preview: "",
  content: "",
  imageUrl: API_IMAGE_PLACEHOLDER_URL,
  readingTimeInMinutes: 0,
  authorId: authorId,
  campaignId: 0,
});

const CreateNewsUpdateForm: FC = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState<CreateNewsUpdateRequestDto>(
    getDefaultFormData(user?.id || "")
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");

  const [paginatedCampaigns, setPaginatedCampaigns] =
    useState<PaginatedCampaignsDto>({
      campaigns: [],
      hasNextPage: false,
      hasPreviousPage: false,
    });
  const [pageIndex, setPageIndex] = useState<number>(DEFAULT_PAGE_INDEX);
  const navigate = useNavigate();
  const {
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleTextEditorChange,
  } = useCustomForm(setFormData);

  useEffect(() => {
    fetchAllActiveAndCompletedCampaigns(pageIndex)
      .then((data) => {
        setPaginatedCampaigns({
          campaigns: paginatedCampaigns.campaigns.concat(data.campaigns),
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage,
        });
      })
      .catch((error) => {
        setRequestError(
          "Failed to load related campaigns. Please, refresh the page!"
        );
        console.log(`Error fetching  campaigns: ${error}`);
      });
  }, [pageIndex]);

  const loadMoreCompletedCampaigns = async (): Promise<void> => {
    if (paginatedCampaigns.hasNextPage)
      setPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

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
      const { data } = await protectedAxios.post<NewsUpdateDto>(
        `${API_URL}/newsUpdates`,
        formData
      );
      console.log(data);

      if (!data.id) {
        throw new Error("News update creation failed");
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
    setFormData(getDefaultFormData(user?.id || ""));
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
          News update title*
        </label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter news update title"
          isRequired
        />
        {errors.title && <ErrorAlert errorMessage={errors.title} />}
      </div>
      <div className="mb-3">
        <label htmlFor="keyWords" className="form-label">
          News update key words*
        </label>
        <Input
          type="text"
          id="keyWords"
          name="keyWords"
          value={formData.keyWords}
          onChange={handleChange}
          placeholder="Enter key words, separate them with a comma:"
          isRequired
        />
        {errors.keyWords && <ErrorAlert errorMessage={errors.keyWords} />}
      </div>
      <div className="mb-3">
        <label htmlFor="previewInput" className="form-label">
          News update preview*
        </label>
        <textarea
          rows={5}
          className="form-control"
          id="previewInput"
          name="preview"
          value={formData.preview}
          onChange={handleChange}
          minLength={20}
          placeholder="Enter a short preview of this news update:"
          required
        />
        {errors.preview && <ErrorAlert errorMessage={errors.preview} />}
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          News update content*
        </label>
        <Editor
          id="content"
          apiKey={API_ENDPOINT}
          initialValue={
            !isNullOrWhitespace(formData.content)
              ? formData.content
              : "<p>Enter news update content.</p>"
          }
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "anchor",
              "autolink",
              "charmap",
              "codesample",
              "emoticons",
              "link",
              "lists",
              "media",
              "searchreplace",
              "table",
              "visualblocks",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            tinycomments_mode: "embedded",
          }}
          onEditorChange={(content) => {
            handleTextEditorChange("content", content);
          }}
        />
        {errors.content && <ErrorAlert errorMessage={errors.content} />}
      </div>
      <div className="mb-3">
        <label htmlFor="readingTimeInMinutes" className="form-label">
          News update reading time in minutes*
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
          isRequired
        />
        {errors.readingTimeInMinutes && (
          <ErrorAlert errorMessage={errors.readingTimeInMinutes} />
        )}
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
          onChange={(e) =>
            handleSelectChange(e, true, undefined, loadMoreCompletedCampaigns)
          }
        >
          {paginatedCampaigns.campaigns.map((campaign) => {
            return (
              <option key={campaign.title} value={campaign.id}>
                {campaign.title}
              </option>
            );
          })}
          <option
            id="loadMoreOption"
            value={LOAD_MORE_SELECT_VALUE}
            disabled={!paginatedCampaigns.hasNextPage}
          >
            Load more
          </option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="image" className="form-label">
          News update preview image*
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
      <div id="formHelpBlock" className="form-text">
        All fields marked with an asterisk (*) are required.
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
