import { FC } from "react";
import { useLocation } from "react-router-dom";
import { CampaignsList } from "../../containers";
import { Alert, SectionHeadline } from "../../components";

const CampaignsIndex: FC = () => {
  const location = useLocation();
  const message: string = location.state?.message || "";

  return (
    <section className="campaigns mt-5" id="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Campaigns"
            title="The United For Ukraine's Current Campaigns"
            headingClassName="campaigns__title"
            description="United For Ukraine is a humanitarian initiative providing aid,
                essential supplies, and support to those affected by the war.
                Through our campaigns, we fundraise for medical assistance,
                protective equipment, and rebuilding efforts, helping Ukrainian
                communities recover and thrive. With global support, we stand
                united for a stronger Ukraine."
          />
          {message && <Alert className="mb-3" message={message} />}
          <CampaignsList
            showPaginationButtons={true}
            showQueryCriteria={true}
            showUserCampaigns={false}
          />
        </div>
      </div>
    </section>
  );
};

export default CampaignsIndex;
