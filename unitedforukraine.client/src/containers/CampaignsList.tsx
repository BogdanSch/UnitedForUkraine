import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Campaign } from "../types";
import { Card, ProgressBar } from "../components";
import formatMoney from "../utils/formatMoney";
import { API_URL } from "../variables";

type CampaignsListProps = {};

const CampaignsList: FC<CampaignsListProps> = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/Campaign/campaigns`,
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setCampaigns(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
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
  );
};

export default CampaignsList;
