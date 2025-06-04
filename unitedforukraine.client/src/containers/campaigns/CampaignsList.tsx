import axios from "axios";
import { FC, useEffect, useState, useRef, FormEvent, useContext } from "react";
import { useSearchParams } from "react-router-dom";

import { CampaignDto } from "../../types";
import { CampaignCategory } from "../../types/enums";
import { CampaignItem } from "../../components";
import CampaignsPaginator from "./CampaignsPaginator";
import AuthContext from "../../contexts/AuthContext";
import { API_URL } from "../../variables";
import { handleSelectWithDataTagChange } from "../../hooks/useCustomForm";

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
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("date_dsc");
  const [filterCategory, setFilterCategory] = useState<CampaignCategory>(
    CampaignCategory.None
  );
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const { user, authToken } = useContext(AuthContext);

  useEffect(() => {
    const currentPage: number = Number(page) > 0 ? Number(page) : 1;
    setPageIndex(currentPage);

    const fetchData = async () => {
      let requestUrl: string;

      if (showUserCampaigns) {
        requestUrl = `${API_URL}/campaigns/users/${user?.id}/supports`;
      } else {
        requestUrl = `${API_URL}/campaigns?page=${currentPage}&sortOrder=${sortOrder}&filterCategory=${filterCategory}`;
        if (searchQuery.length > 0)
          requestUrl += `&searchedQuery=${searchQuery}`;
      }

      const options: Record<string, any> = {
        method: "GET",
        url: requestUrl,
      };

      if (showUserCampaigns) {
        options.headers = {
          Authorization: `Bearer ${authToken}`,
        };
      }

      try {
        const { data } = await axios.request(options);

        setCampaigns(data.campaigns || []);
        setHasPreviousPage(data.hasPreviousPage);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [page, searchQuery, sortOrder, filterCategory]);

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
            <div className="input-group campaigns__query-search">
              <div className="form-outline">
                <input
                  type="search"
                  id="searchInput"
                  className="form-control campaigns__query-search-input"
                  ref={searchInputRef}
                  placeholder="What are we searching for: military, support, Ukraine?"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary input-group-button"
              >
                <i className="bi bi-search-heart"></i>
              </button>
            </div>
            <div className="campaigns__query-group">
              <select
                className="form-select campaigns__query-filter"
                id="sortOrder"
                name="sortOrder"
                // value={sortOrder}
                onChange={(e) => handleSelectWithDataTagChange(e, setSortOrder)}
              >
                <option data-value="date_dsc">Most Recent</option>
                <option data-value="title_asc">Title</option>
                <option data-value="mostFunded_dsc">Most Funded</option>
                <option data-value="nearGoal_dsc">Near Goal</option>
                <option data-value="nearEnd_dsc">Near End</option>
              </select>
              <select
                id="filterCategory"
                name="filterCategory"
                className="form-select campaigns__query-filter"
                value={filterCategory}
                onChange={(e) =>
                  handleSelectWithDataTagChange(e, setFilterCategory)
                }
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
            </div>
          </div>
        </form>
      )}
      <ul className="campaigns__list mt-5">
        {campaigns.length > 0 ? (
          campaigns.map((campaign: CampaignDto) => (
            <CampaignItem key={campaign.id} campaign={campaign} />
          ))
        ) : (
          <p className="text-center">No campaigns have been found!</p>
        )}
      </ul>
      {showPaginationButtons && campaigns.length > 0 && (
        <CampaignsPaginator
          currentPageIndex={pageIndex}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
        />
      )}
    </>
  );
};

export default CampaignsList;
