import { FC, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { CampaignDto } from "../../types";
import {
  Alert,
  CampaignActionButton,
  Image,
  ProgressBar,
  ShareCampaignButton,
  Timeline,
} from "../../components";
import {
  CampaignLikeButton,
  CampaignStatisticsList,
  DeleteCampaignForm,
  DonationsList,
  NewsUpdatesList,
} from "../../containers/";
import AuthContext from "../../contexts/AuthContext";
import {
  convertCampaignCategoryToString,
  convertCampaignStatusToString,
  fetchCampaignData,
  getCampaignTimelines,
} from "../../utils/services/campaignService";
import {
  convertCurrencyToString,
  formatMoney,
} from "../../utils/helpers/currencyHelper";

const CampaignsDetail: FC = () => {
  const [campaign, setCampaign] = useState<CampaignDto | null>(null);
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  let { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const message: string = location.state?.message || "";

  useEffect(() => {
    fetchCampaignData(Number(id)).then((data) => {
      if (!data) {
        navigate("/notFound");
        return;
      }
      setCampaign(data);
    });
  }, [id]);

  return (
    <section className="campaigns-detail">
      <div className="container">
        {message && <Alert className="mb-3" message={message} />}
        <CampaignStatisticsList id={Number(id)} />
        <article className="campaigns-detail__header">
          {isAuthenticated() && isAdmin() && (
            <ul className="campaigns-detail__buttons-list">
              <li className="campaigns-detail__buttons-item">
                <Link
                  className="btn btn-primary btn-icon"
                  to={`/campaigns/edit/${id}`}
                >
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
                  campaign?.status || 0,
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
                <strong>Raised:</strong>{" "}
                {formatMoney(campaign?.raisedAmount ?? 0)}{" "}
                {convertCurrencyToString(campaign?.currency || 0)}
              </p>
              <p>
                <strong>Goal:</strong> {formatMoney(campaign?.goalAmount ?? 0)}{" "}
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
                <ul className="campaigns-detail__buttons-list">
                  <li className="campaigns-detail__buttons-item">
                    <CampaignActionButton
                      campaignId={campaign?.id!}
                      campaignStatus={campaign?.status!}
                    />
                  </li>
                  <li className="campaigns-detail__buttons-item">
                    <ShareCampaignButton
                      relativeUrl={`/campaigns/detail/${id}`}
                      campaignTitle={campaign?.title ?? ""}
                      campaignGoalAmount={campaign?.goalAmount ?? 0}
                      campaignRaisedAmount={campaign?.raisedAmount ?? 0}
                    />
                  </li>
                  {isAuthenticated() && campaign && (
                    <li className="campaigns-detail__buttons-item">
                      <CampaignLikeButton campaign={campaign} />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="donations mt-5">
            <h3 className="sub-heading">
              In total {campaign?.donorsCount}{" "}
              {campaign?.donorsCount == 1 ? "donor" : "donors"} contributed
            </h3>
            <DonationsList
              name="campaignDonations"
              campaignId={Number(id)}
              showUserDonations={false}
              showQueryCriteria={false}
            />
          </div>
          {campaign?.id && (
            <div className="news mt-5">
              <h3 className="sub-heading">All related news and updates</h3>
              <NewsUpdatesList
                campaignId={Number(campaign?.id)}
                showQueryCriteria={false}
                showPaginationButtons={false}
              />
            </div>
          )}
        </article>
      </div>
    </section>
  );
};

export default CampaignsDetail;
