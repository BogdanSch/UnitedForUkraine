import axios from "axios";
import { protectedAxios } from "../../utils/axiosInstances";
import { FC, useEffect, useState, useRef, FormEvent, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { CampaignDto, PaginatedCampaignsDto } from "../../types";
import { CampaignCategory, CampaignStatus, Currency } from "../../types/enums";
import { CampaignItem, Paginator, SearchBar } from "../../components";
import AuthContext from "../../contexts/AuthContext";
import { API_URL } from "../../variables";
import { handleSelectWithDataTagChange } from "../../hooks/useCustomForm";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";

type CampaignsListProps = {
  showPaginationButtons: boolean;
  showQueryCriteria: boolean;
  showUserCampaigns: boolean;
};

const CampaignsList: FC<CampaignsListProps> = ({
  showPaginationButtons,
  showQueryCriteria,
  showUserCampaigns,
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
  const [status, setStatus] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");

  const { user } = useContext(AuthContext);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    const currentPage: number = Number(page) > 0 ? Number(page) : 1;
    setPageIndex(currentPage);

    const fetchData = async () => {
      let requestUrl: string;

      if (showUserCampaigns) {
        requestUrl = `${API_URL}/campaigns/users/${user?.id}/supports`;
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

      let axiosInstance = showUserCampaigns ? protectedAxios : axios;

      try {
        const { data } = await axiosInstance.get<PaginatedCampaignsDto>(
          requestUrl
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
        <form className="campaigns__query" onSubmit={handleSearch}>
          <div className="campaigns__query-container">
            <SearchBar
              searchInputReference={searchInputRef}
              className={"campaigns"}
            />
            <div className="campaigns__query-group">
              <select
                className="form-select campaigns__query-filter"
                id="sortOrder"
                name="sortOrder"
                onChange={(e) => handleSelectWithDataTagChange(e, setSortOrder)}
              >
                <option data-value="date_dsc">Most Recent</option>
                <option data-value="title_asc">Title</option>
                <option data-value="mostFunded_dsc">Most Funded</option>
                <option data-value="nearGoal_dsc">Near Goal</option>
                <option data-value="nearEnd_dsc">Near End</option>
              </select>
              <select
                name="category"
                className="form-select campaigns__query-filter"
                value={category}
                onChange={(e) => {
                  handleSelectWithDataTagChange(e, setCategory);
                }}
              >
                {Object.keys(CampaignCategory)
                  .filter((key) => !isNaN(Number(CampaignCategory[key as any])))
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
              <select
                name="currency"
                className="form-select campaigns__query-filter"
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
              <select
                name="status"
                className="form-select campaigns__query-filter"
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
                      value={CampaignStatus[key as keyof typeof CampaignStatus]}
                      data-value={index}
                    >
                      {key}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </form>
      )}
      {paginatedCampaigns.campaigns.length > 0 ? (
        <ul className="campaigns__list mt-5">
          {paginatedCampaigns.campaigns.map((campaign: CampaignDto) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))}
        </ul>
      ) : (
        <p className="text-center">No campaigns have been found.</p>
      )}
      {showPaginationButtons && paginatedCampaigns.campaigns.length > 0 && (
        <Paginator
          linkPath={"/campaigns"}
          currentPageIndex={pageIndex}
          hasPreviousPage={paginatedCampaigns.hasPreviousPage}
          hasNextPage={paginatedCampaigns.hasNextPage}
        />
      )}
    </>
  );
};

export default CampaignsList;
