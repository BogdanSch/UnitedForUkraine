import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, ProgressBar, MatchHighlight } from "..";
import { CampaignDto } from "../../types";
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
  buttons?: ReactNode;
}

const CampaignItem: FC<ICampaignItemProps> = ({
  campaign,
  searchQuery,
  buttons,
}) => {
  return (
    <li className="campaigns__item" key={`campaign-${campaign.id}`}>
      <Card
        imageSrc={campaign.imageUrl}
        imageAlt={campaign.title}
        cardStatus={convertCampaignStatusToString(campaign.status)}
        isLite={false}
        cardButtons={buttons}
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
      </Card>
    </li>
  );
};
export default CampaignItem;
