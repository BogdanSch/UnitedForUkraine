import { FC } from "react";
import { CampaignsList } from "../../containers";

const CampaignIndex: FC = () => {
  return (
    <section className="campaigns mt-5" id="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <div className="campaigns__headline">
            <div className="text-group">
              <h4 className="section-indicator">Campaigns</h4>
              <h2 className="campaigns__title">
                The United For Ukraine Current Campaigns
              </h2>
              <p className="campaigns__description">
                United For Ukraine is a humanitarian initiative providing aid,
                essential supplies, and support to those affected by the war.
                Through our campaigns, we fundraise for medical assistance,
                protective equipment, and rebuilding efforts, helping Ukrainian
                communities recover and thrive. With global support, we stand
                united for a stronger Ukraine.
              </p>
            </div>
          </div>
          <CampaignsList showPaginationButtons={true} />
        </div>
      </div>
    </section>
  );
};

export default CampaignIndex;
