import { FC } from "react";
import { Link } from "react-router-dom";
import { CampaignDto } from "../../types";
import { CampaignActionButton, Card, ProgressBar, ShareButton } from "..";
import {
  convertCampaignCategoryToString,
  convertCampaignStatusToString,
} from "../../utils/helpers/campaignHelper";
import {
  convertCurrencyToString,
  formatMoney,
} from "../../utils/helpers/currencyHelper";

interface ICampaignItemProps {
  campaign: CampaignDto;
}

const CampaignItem: FC<ICampaignItemProps> = ({ campaign }) => {
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
          <h3 className="card-title">{campaign.title}</h3>
          <ul className="card-category">
            <li className="card-category__item">
              {convertCampaignCategoryToString(campaign.category)}
            </li>
          </ul>
          <p className="card-text text-muted">{campaign.description}</p>
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
