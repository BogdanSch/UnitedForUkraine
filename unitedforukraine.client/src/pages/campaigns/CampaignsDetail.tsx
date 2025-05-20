import { FC, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CampaignDto, TimelineItem } from "../../types";
import {
  CampaignActionButton,
  Image,
  ProgressBar,
  ShareButton,
  Timeline,
} from "../../components";
import { CampaignDonationsList, DeleteCampaignForm } from "../../containers/";
import AuthContext from "../../contexts/AuthContext";
import {
  convertCampaignCategoryToString,
  convertCampaignStatusToString,
  fetchCampaignData,
} from "../../utils/campaignHelper";
import { convertCurrencyToString } from "../../utils/currency";

const CampaignsDetail: FC = () => {
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  let { id } = useParams();
  const { isAdmin, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetcher = async () => {
      const data = await fetchCampaignData(Number(id));

      if (!data) {
        navigate("/notFound");
        return;
      }

      setCampaign(await fetchCampaignData(Number(id)));
    };
    fetcher();
  }, [id]);

  const getCampaignTimelines = (): TimelineItem[] => {
    if (!campaign) return [];

    let startDate: string = campaign ? campaign.startDate : "";
    let endDate: string = campaign ? campaign.endDate : "";

    return [
      {
        date: new Date(startDate).toLocaleDateString(),
        description: "Start date",
      },
      {
        date: new Date().toLocaleDateString(),
        description: "Current date",
      },
      { date: new Date(endDate).toLocaleDateString(), description: "End date" },
    ];
  };

  return (
    <section className="campaigns-detail">
      <div className="container">
        <article className="campaigns-detail__header">
          {isAuthenticated() && isAdmin() && (
            <ul className="campaigns-detail__buttons-list">
              <li className="campaigns-detail__buttons-item">
                <Link className="btn btn-primary" to={`/campaigns/edit/${id}`}>
                  Edit Campaign
                </Link>
              </li>
              <li className="campaigns-detail__button-item">
                <DeleteCampaignForm id={Number(id)} />
              </li>
            </ul>
          )}
          <Image
            className="campaigns-detail__image"
            src={campaign?.imageUrl!}
            alt={campaign?.title!}
          />
          <div className="campaigns-detail__info card p-5 mb-4">
            <div className="text-content">
              <h1 className="heading mb-2">{campaign?.title}</h1>
              <div className="campaigns-detail__category">
                {/* <h4 className="sub-heading campaigns-detail__title">
                  Campaign's category:{" "}
                </h4> */}
                <ul className="campaigns-detail__list">
                  <li className="campaigns-detail__item">
                    {campaign?.category &&
                      convertCampaignCategoryToString(campaign.category)}
                  </li>
                </ul>
              </div>
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
              <ShareButton
                relativeUrl={`/campaigns/detail/${id}`}
                campaignTitle={campaign?.title ?? ""}
                campaignGoalAmount={campaign?.goalAmount ?? 0}
                campaignRaisedAmount={campaign?.raisedAmount ?? 0}
              />
            </div>
          </div>
          <CampaignDonationsList campaignId={id} />
        </article>
      </div>
    </section>
  );
};

export default CampaignsDetail;
