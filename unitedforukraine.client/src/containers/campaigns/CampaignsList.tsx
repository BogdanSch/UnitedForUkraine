import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Campaign } from "../../types";
import { Card, ProgressBar } from "../../components";
import formatMoney from "../../utils/formatMoney";
import { API_URL } from "../../variables";
import CampaignsPaginator from "./CampaignsPaginator";

type CampaignsListProps = {
  showPaginationButtons: boolean;
};

const CampaignsList: FC<CampaignsListProps> = ({
  showPaginationButtons,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
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
        url: `${API_URL}/Campaign/campaigns?page=${currentPage}`,
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
      <ul className="campaigns__list mt-5">
        {campaigns.length > 0 ? (
          campaigns.map((campaign: Campaign) => (
            <li className="campaigns__item" key={campaign.id}>
              <Card
                imageSrc={campaign.imageUrl}
                imageAlt={campaign.title}
                cardStatus={campaign.status}
              >
                <h3 className="card-title">{campaign.title}</h3>
                <p className="card-text text-muted">{campaign.description}</p>
                <p className="card-text text-muted">
                  <strong>Goal:</strong> {formatMoney(campaign.goalAmount)}{" "}
                  {campaign.currency}
                </p>
                <ProgressBar
                  className="mt-3 mb-4"
                  currentAmount={campaign.raisedAmount}
                  requiredAmount={campaign.goalAmount}
                />
                {campaign.status === "Ongoing" ? (
                  <Link
                    className="btn btn-outline-success"
                    to={`/campaigns/detail/${campaign.id}/`}
                  >
                    <div className="d-flex flex-row align-items-center gap-2">
                      <span>Donate Now</span>
                      <i className="bi bi-cash-coin"></i>
                    </div>
                  </Link>
                ) : (
                  <Link
                    className="btn btn-success"
                    to={`/campaigns/detail/${campaign.id}/`}
                  >
                    <span>Coming soon</span>
                  </Link>
                )}
              </Card>
            </li>
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
          // setNewPageIndex={setPageIndex}
        />
      )}
    </>
  );
};

export default CampaignsList;
