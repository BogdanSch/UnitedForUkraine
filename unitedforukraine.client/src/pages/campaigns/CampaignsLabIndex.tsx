import { FC } from "react";
import { CampaignsTable } from "../../containers";
import { SectionHeadline } from "../../components";

const CampaignsLabIndex: FC = () => {
  return (
    <section className="campaigns mt-5" id="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Campaigns Labwork"
            title="The United For Ukraine's Current Campaigns"
            headingClassName="campaigns__title"
            description="United For Ukraine is a humanitarian initiative providing aid,
                essential supplies, and support to those affected by the war.
                Through our campaigns, we fundraise for medical assistance,
                protective equipment, and rebuilding efforts, helping Ukrainian
                communities recover and thrive. With global support, we stand
                united for a stronger Ukraine."
          />
          <CampaignsTable showPaginationButtons={true} />
        </div>
      </div>
    </section>
  );
};

export default CampaignsLabIndex;
