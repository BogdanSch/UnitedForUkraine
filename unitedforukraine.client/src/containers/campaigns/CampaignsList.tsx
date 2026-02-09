import axios from "axios";
import { protectedAxios } from "../../utils/axiosInstances";
import { FC, useEffect, useState, useRef, FormEvent, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CampaignActionButton,
  CampaignItem,
  Paginator,
  SearchBar,
  ShareCampaignButton,
} from "../../components";
import { CampaignLikeButton } from "../";
import AuthContext from "../../contexts/AuthContext";
import { handleSelectWithDataTagChange } from "../../hooks/useCustomForm";
import { CampaignDto, PaginatedCampaignsDto } from "../../types";
import { CampaignCategory, CampaignStatus, Currency } from "../../types/enums";
import { API_URL } from "../../variables";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";

type CampaignsListProps = {
  showPaginationButtons: boolean;
  showQueryCriteria: boolean;
  showUserCampaigns: boolean;
  showOnlyLikedCampaigns?: boolean;
  paginationLinkPath?: string;
  paginationLinkHash?: string;
};

const CampaignsList: FC<CampaignsListProps> = ({
  showPaginationButtons,
  showQueryCriteria,
  showUserCampaigns,
  showOnlyLikedCampaigns = false,
  paginationLinkPath,
  paginationLinkHash,
}) => {
  const [paginatedCampaigns, setPaginatedCampaigns] =
    useState<PaginatedCampaignsDto>({
      campaigns: [],
      hasNextPage: false,
      hasPreviousPage: false,
    });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("date_dsc");
  const [pageIndex, setPageIndex] = useState<number>(1);

  const [category, setCategory] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [status, setStatus] = useState<string>("1");

  const { isAuthenticated } = useContext(AuthContext);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    const currentPage: number = Number(page) > 0 ? Number(page) : 1;
    setPageIndex(currentPage);

    const fetchData = async () => {
      let requestUrl: string;

      if (showOnlyLikedCampaigns) {
        requestUrl = `${API_URL}/campaigns/me/liked?page=${currentPage}`;
      } else if (showUserCampaigns) {
        requestUrl = `${API_URL}/campaigns/me/supported?page=${currentPage}`;
      } else {
        requestUrl = `${API_URL}/campaigns?page=${currentPage}&sortOrder=${sortOrder}`;
        requestUrl += !isNullOrWhitespace(category)
          ? `&categories=${category}`
          : "";
        requestUrl += !isNullOrWhitespace(status) ? `&statuses=${status}` : "";
        requestUrl += !isNullOrWhitespace(currency)
          ? `&currencies=${currency}`
          : "";
      }
      requestUrl += !isNullOrWhitespace(searchQuery)
        ? `&searchedQuery=${searchQuery}`
        : "";

      let axiosInstance =
        showUserCampaigns || showOnlyLikedCampaigns ? protectedAxios : axios;

      try {
        const { data } = await axiosInstance.get<PaginatedCampaignsDto>(
          requestUrl,
          {
            withCredentials: true,
          }
        );
        setPaginatedCampaigns(data);
      } catch (error) {
        console.log(`Error fetching campaigns: ${error}`);
      }
    };

    fetchData();
  }, [page, searchQuery, sortOrder, category, status, currency]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const searchInput: HTMLInputElement | null = searchInputRef.current;
    if (!searchInput) return;
    setSearchQuery(searchInput.value);
  };

  return (
    <>
      {showQueryCriteria && (
        <form className="query" onSubmit={handleSearch}>
          <div className="query__container">
            <SearchBar searchInputReference={searchInputRef} />
            <fieldset className="query__group">
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor="sortOrderSelect"
                >
                  Select how to sort:
                </label>
                <select
                  className="form-select query__filter"
                  id="sortOrderSelect"
                  name="sortOrder"
                  onChange={(e) =>
                    handleSelectWithDataTagChange(e, setSortOrder)
                  }
                >
                  <option data-value="date_dsc">Most Recent</option>
                  <option data-value="title_asc">Title</option>
                  <option data-value="nearGoal_dsc">Near Goal</option>
                  <option data-value="nearEnd_asc">Near End</option>
                </select>
              </div>
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor="categoryFilter"
                >
                  Select category:
                </label>
                <select
                  name="category"
                  id="categoryFilter"
                  className="form-select query__filter"
                  value={category}
                  onChange={(e) => {
                    handleSelectWithDataTagChange(e, setCategory);
                  }}
                >
                  {Object.keys(CampaignCategory)
                    .filter(
                      (key) => !isNaN(Number(CampaignCategory[key as any]))
                    )
                    .map((key, index) => (
                      <option
                        key={key}
                        value={
                          CampaignCategory[key as keyof typeof CampaignCategory]
                        }
                        data-value={index}
                      >
                        {key}
                      </option>
                    ))}
                </select>
              </div>
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor="currencyFilter"
                >
                  Select currency:
                </label>
                <select
                  name="currency"
                  id="currencyFilter"
                  className="form-select query__filter"
                  value={currency}
                  onChange={(e) => {
                    handleSelectWithDataTagChange(e, setCurrency);
                  }}
                >
                  <option value="" data-value="">
                    All Currencies
                  </option>
                  {Object.keys(Currency)
                    .filter((key) => !isNaN(Number(Currency[key as any])))
                    .map((key, index) => (
                      <option
                        key={key}
                        value={Currency[key as keyof typeof Currency]}
                        data-value={index}
                      >
                        {key}
                      </option>
                    ))}
                </select>
              </div>
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor="statusFilter"
                >
                  Select status:
                </label>
                <select
                  name="status"
                  id="statusFilter"
                  className="form-select query__filter"
                  value={status}
                  onChange={(e) => {
                    handleSelectWithDataTagChange(e, setStatus);
                  }}
                >
                  {Object.keys(CampaignStatus)
                    .filter((key) => !isNaN(Number(CampaignStatus[key as any])))
                    .map((key, index) => (
                      <option
                        key={key}
                        value={
                          CampaignStatus[key as keyof typeof CampaignStatus]
                        }
                        data-value={index}
                      >
                        {key}
                      </option>
                    ))}
                </select>
              </div>
            </fieldset>
          </div>
        </form>
      )}
      {paginatedCampaigns.campaigns.length > 0 ? (
        <ul className="campaigns__list mt-5">
          {paginatedCampaigns.campaigns.map((campaign: CampaignDto) => (
            <CampaignItem
              key={campaign.id}
              campaign={campaign}
              searchQuery={searchQuery}
              buttons={
                <ul className="campaigns__item-buttons">
                  <li className="campaigns__item-button">
                    <CampaignActionButton
                      campaignId={campaign.id}
                      campaignStatus={campaign.status}
                    />
                  </li>
                  <li className="campaigns__item-button">
                    <ul className="campaigns__item-buttons">
                      <li className="campaigns__item-button">
                        <ShareCampaignButton
                          relativeUrl={`/campaigns/detail/${campaign.id}/`}
                          campaignTitle={campaign.title}
                          campaignGoalAmount={campaign.goalAmount}
                          campaignRaisedAmount={campaign.raisedAmount}
                        />
                      </li>
                      {isAuthenticated() && (
                        <li className="campaigns__item-button">
                          <CampaignLikeButton
                            campaign={campaign}
                            handleDislike={() => {
                              if (!showOnlyLikedCampaigns) return;

                              setPaginatedCampaigns((prev) => {
                                return {
                                  ...prev,
                                  campaigns: prev.campaigns.filter(
                                    (c) => c.id !== campaign.id
                                  ),
                                };
                              });
                            }}
                          />
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              }
            />
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-center">No campaigns have been found.</p>
      )}
      {showPaginationButtons && paginatedCampaigns.campaigns.length > 0 && (
        <Paginator
          linkHash={paginationLinkHash ?? ""}
          linkPath={paginationLinkPath ?? "/campaigns"}
          currentPageIndex={pageIndex}
          hasPreviousPage={paginatedCampaigns.hasPreviousPage}
          hasNextPage={paginatedCampaigns.hasNextPage}
        />
      )}
    </>
  );
};

export default CampaignsList;
