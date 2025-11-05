import { FC } from "react";
import { CampaignsTable } from "../../containers";
import { SectionHeadline } from "../../components";

const Labwork1CampaignsIndex: FC = () => {
  return (
    <section className="lab mt-5" id="lab">
      <div className="container">
        <div className="lab__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Labwork 1"
            title="Campaigns"
            headingClassName="heading"
          />
          <CampaignsTable showPaginationButtons={true} />
        </div>
      </div>
    </section>
  );
};

export default Labwork1CampaignsIndex;
