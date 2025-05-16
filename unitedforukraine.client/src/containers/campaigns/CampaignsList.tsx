import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CampaignDto } from "../../types";
import { CampaignItem } from "../../components";
import { API_URL } from "../../variables";
import CampaignsPaginator from "./CampaignsPaginator";

type CampaignsListProps = {
  showPaginationButtons: boolean;
};

const CampaignsList: FC<CampaignsListProps> = ({ showPaginationButtons }) => {
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    const currentPage: number = Number(page) > 0 ? Number(page) : 1;
    setPageIndex(currentPage);

    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/campaigns?page=${currentPage}`,
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setCampaigns(data.campaigns || []);
        setHasPreviousPage(data.hasPreviousPage);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [page]);

  return (
    <>
      <form className="campaigns__search">
        <div className="input-group">
          <div className="form-outline" data-mdb-input-init>
            <input
              type="search"
              id="searchInput"
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label className="form-label" htmlFor="searchInput">
              Search
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            data-mdb-ripple-init
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
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
