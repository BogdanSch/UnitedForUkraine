import { FC } from "react";
import { Link } from "react-router-dom";
import { CampaignDto } from "../../types";
import {
  CampaignActionButton,
  Card,
  ProgressBar,
  ShareButton,
  MatchHighlight,
} from "..";
import {
  convertCampaignCategoryToString,
  convertCampaignStatusToString,
} from "../../utils/services/campaignService";
import {
  convertCurrencyToString,
  formatMoney,
} from "../../utils/helpers/currencyHelper";
import formatNumber from "../../utils/helpers/formatNumber";

interface ICampaignItemProps {
  campaign: CampaignDto;
  searchQuery: string;
}

const CampaignItem: FC<ICampaignItemProps> = ({ campaign, searchQuery }) => {
  return (
    <li className="campaigns__item" key={`campaign-${campaign.id}`}>
      <Card
        imageSrc={campaign.imageUrl}
        imageAlt={campaign.title}
        cardStatus={convertCampaignStatusToString(campaign.status)}
        isLite={false}
      >
        <Link
          to={`/campaigns/detail/${campaign.id}/`}
          className="campaigns__item-link"
        >
          <h3 className="card-title mb-0">
            <MatchHighlight text={campaign.title} query={searchQuery} />
          </h3>
          <p className="card-text text-muted mb-1">
            <MatchHighlight text={campaign.slogan} query={searchQuery} />
          </p>
          <ul className="card-category">
            <li className="card-category__item">
              {convertCampaignCategoryToString(campaign.category)}
            </li>
            <li className="card-category__item">
              {formatNumber(campaign.donorsCount)} donors
            </li>
          </ul>
          <p className="card-text text-muted">
            <MatchHighlight text={campaign.description} query={searchQuery} />
          </p>
          <p className="card-text text-muted">
            <strong>Goal:</strong> {formatMoney(campaign.goalAmount)}{" "}
            {convertCurrencyToString(campaign.currency)}
          </p>
        </Link>
        <ProgressBar
          className="mt-3 mb-4"
          currentAmount={campaign.raisedAmount}
          requiredAmount={campaign.goalAmount}
        />
        <ul className="campaigns__item-buttons">
          <li className="campaigns__item-button">
            <CampaignActionButton
              campaignId={campaign.id}
              campaignStatus={campaign.status}
            />
          </li>
          <li className="campaigns__item-button">
            <ShareButton
              relativeUrl={`/campaigns/detail/${campaign.id}/`}
              campaignTitle={campaign.title}
              campaignGoalAmount={campaign.goalAmount}
              campaignRaisedAmount={campaign.raisedAmount}
            />
          </li>
        </ul>
      </Card>
    </li>
  );
};
export default CampaignItem;
