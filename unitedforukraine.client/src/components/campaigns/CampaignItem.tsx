import { FC } from "react";
import { Link } from "react-router-dom";
import { CampaignDto } from "../../types";
import { CampaignActionButton, Card, ProgressBar, ShareButton } from "..";
import { convertCampaignStatusToString } from "../../utils/campaignHelper";
import { convertCurrencyToString, formatMoney } from "../../utils/currency";

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
      >
        <Link
          to={`/campaigns/detail/${campaign.id}/`}
          className="campaigns__item-link"
        >
          <h3 className="card-title">{campaign.title}</h3>
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
