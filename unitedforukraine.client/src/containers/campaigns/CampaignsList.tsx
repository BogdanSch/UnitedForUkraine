import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { CampaignDto } from "../../types";
import { CampaignActionButton, Card, ProgressBar } from "../../components";
import { API_URL } from "../../variables";
import CampaignsPaginator from "./CampaignsPaginator";
import { convertCampaignStatusToString } from "../../utils/campaignHelper";
import { convertCurrencyToString, formatMoney } from "../../utils/currency";

type CampaignsListProps = {
  showPaginationButtons: boolean;
};

const CampaignsList: FC<CampaignsListProps> = ({ showPaginationButtons }) => {
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);
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
      <ul className="campaigns__list mt-5">
        {campaigns.length > 0 ? (
          campaigns.map((campaign: CampaignDto) => (
            <li className="campaigns__item" key={campaign.id}>
              <Card
                imageSrc={campaign.imageUrl}
                imageAlt={campaign.title}
                cardStatus={convertCampaignStatusToString(campaign.status)}
              >
                <h3 className="card-title">{campaign.title}</h3>
                <p className="card-text text-muted">{campaign.description}</p>
                <p className="card-text text-muted">
                  <strong>Goal:</strong> {formatMoney(campaign.goalAmount)}{" "}
                  {convertCurrencyToString(campaign.currency)}
                </p>
                <ProgressBar
                  className="mt-3 mb-4"
                  currentAmount={campaign.raisedAmount}
                  requiredAmount={campaign.goalAmount}
                />
                <CampaignActionButton
                  campaignId={campaign.id}
                  campaignStatus={campaign.status}
                />
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
        />
      )}
    </>
  );
};

export default CampaignsList;
