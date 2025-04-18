import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_URL } from "../../variables";
import { CampaignDto, TimelineItem } from "../../types";
import {
  CampaignActionButton,
  Image,
  ProgressBar,
  Timeline,
} from "../../components";
import CampaigDonationsList from "../../containers/campaigns/CampaignDonationsList";
import { convertCampaignStatusToString } from "../../utils/campaignMapper";
import { convertCurrencyToString } from "../../utils/currency";

const CampaignsDetail: FC = () => {
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  const navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const fetchCampaignData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/campaigns/${id}`,
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setCampaign(data);
      } catch (error) {
        console.error(error);
        navigate("/notFound");
      }
    };

    fetchCampaignData();
  }, [id]);

  function getCampaignTimelines(): TimelineItem[] {
    if (!campaign) return [];

    let startDate: string = campaign ? campaign.startDate : "";
    let endDate: string = campaign ? campaign.endDate : "";

    return [
      { date: startDate, description: "Start date" },
      {
        date: new Date().toLocaleDateString(),
        description: "Current date",
      },
      { date: endDate, description: "End date" },
    ];
  }

  return (
    <section className="campaigns-detail">
      <div className="container">
        <article className="campaigns-detail__header">
          <Image
            className="campaigns-detail__image"
            src={campaign?.imageUrl!}
            alt={campaign?.title!}
          />
          <div className="campaigns-detail__info card p-5 mb-4">
            <div className="text-content">
              <h1 className="heading mb-2">{campaign?.title}</h1>
              <p className="campaigns-detail__description">
                {campaign?.description}
              </p>
              <div className="mt-3">
                <CampaignActionButton
                  campaignId={campaign?.id!}
                  campaignStatus={campaign?.status!}
                />
              </div>
            </div>
            <Timeline timelines={getCampaignTimelines()} />
            <div className="campaigns-detail__status">
              <span
                className={`status ${convertCampaignStatusToString(
                  campaign?.status || 0
                )}`}
              >
                {convertCampaignStatusToString(campaign?.status || 0)}
              </span>
            </div>
          </div>
          <div className="campaigns-detail__progress card mb-4">
            <h2 className="sub-heading">{campaign?.title} - Progress</h2>
            <div className="mt-3">
              <p>
                <strong>Raised:</strong> {campaign?.raisedAmount}{" "}
                {convertCurrencyToString(campaign?.currency || 0)}
              </p>
              <p>
                <strong>Goal:</strong> {campaign?.goalAmount}{" "}
                {convertCurrencyToString(campaign?.currency || 0)}
              </p>
              <div className="w-50 mx-auto">
                <ProgressBar
                  className="mt-3 mb-4"
                  currentAmount={campaign?.raisedAmount || 0}
                  requiredAmount={campaign?.goalAmount || 0}
                />
              </div>
            </div>
          </div>
          <CampaigDonationsList campaignId={id} />
        </article>
      </div>
    </section>
  );
};

export default CampaignsDetail;
