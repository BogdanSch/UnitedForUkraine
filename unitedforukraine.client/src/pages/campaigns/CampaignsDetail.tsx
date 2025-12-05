import { FC, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CampaignDto } from "../../types";
import {
  Alert,
  CampaignActionButton,
  Image,
  ProgressBar,
  ShareButton,
  Timeline,
} from "../../components";
import { DeleteCampaignForm, DonationsList } from "../../containers/";
import AuthContext from "../../contexts/AuthContext";
import {
  convertCampaignCategoryToString,
  convertCampaignStatusToString,
  fetchCampaignData,
  getCampaignTimelines,
} from "../../utils/services/campaignService";
import { convertCurrencyToString } from "../../utils/helpers/currencyHelper";

const CampaignsDetail: FC = () => {
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const message: string = location.state?.message || "";

  useEffect(() => {
    const fetcher = async () => {
      const data = await fetchCampaignData(Number(id));

      if (!data) {
        navigate("/notFound");
        return;
      }

      setCampaign(data);
    };
    fetcher();
  }, [id]);

  return (
    <section className="campaigns-detail">
      <div className="container">
        {message && <Alert className="mb-3" message={message} />}
        <article className="campaigns-detail__header">
          {isAuthenticated() && isAdmin() && (
            <ul className="campaigns-detail__buttons-list">
              <li className="campaigns-detail__buttons-item">
                <Link className="btn btn-primary" to={`/campaigns/edit/${id}`}>
                  <span>Edit this Campaign</span>
                  <i className="bi bi-pencil-square"></i>
                </Link>
              </li>
              <li className="campaigns-detail__button-item">
                <DeleteCampaignForm id={Number(id)} />
              </li>
            </ul>
          )}
          <Image
            imageClassName="campaigns-detail__image"
            src={campaign?.imageUrl!}
            alt={campaign?.title!}
          />
          <div className="campaigns-detail__info card p-5 mb-4">
            <div className="text-content">
              <h1 className="heading mb-0">{campaign?.title}</h1>
              <p className="campaigns-detail__description mb-3">
                {campaign?.slogan}
              </p>
              <div className="campaigns-detail__category">
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
            {campaign && (
              <Timeline timelines={getCampaignTimelines(campaign)} />
            )}
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
              <div className="campaigns-detail__buttons mt-3">
                <CampaignActionButton
                  campaignId={campaign?.id!}
                  campaignStatus={campaign?.status!}
                />
                <ShareButton
                  relativeUrl={`/campaigns/detail/${id}`}
                  campaignTitle={campaign?.title ?? ""}
                  campaignGoalAmount={campaign?.goalAmount ?? 0}
                  campaignRaisedAmount={campaign?.raisedAmount ?? 0}
                />
              </div>
            </div>
          </div>
          <h3 className="mt-5 sub-heading">
            In total {campaign?.donorsCount} donors contributed
          </h3>
          <DonationsList
            name="campaignDonations"
            campaignId={Number(id)}
            showUserDonations={false}
            showQueryCriteria={false}
          />
        </article>
      </div>
    </section>
  );
};

export default CampaignsDetail;
