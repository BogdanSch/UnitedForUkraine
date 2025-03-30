import { FC } from "react";
import { Link } from "react-router-dom";
import { CampaignStatus } from "../../types";

type CampaignActionButtonProps = {
  campaignId: number;
  campaignStatus: CampaignStatus;
};

const CampaignActionButton: FC<CampaignActionButtonProps> = ({
  campaignId,
  campaignStatus,
}) => {
  return campaignStatus === CampaignStatus.Ongoing ? (
    <Link
      className="btn btn-outline-primary"
      to={`/campaigns/detail/${campaignId}/`}
    >
      <div className="d-flex flex-row align-items-center gap-2">
        <span>Donate Now</span>
        <i className="bi bi-cash-coin"></i>
      </div>
    </Link>
  ) : campaignStatus === CampaignStatus.Completed ? (
    <Link
      className="btn btn-outline-success"
      to={`/campaigns/detail/${campaignId}/`}
    >
      <div className="d-flex flex-row align-items-center gap-2">
        <span>Completed</span>
        <i className="bi bi-check-all"></i>
      </div>
    </Link>
  ) : (
    <Link className="btn btn-info" to={`/campaigns/detail/${campaignId}/`}>
      <span>Coming soon...</span>
    </Link>
  );
};

export default CampaignActionButton;
