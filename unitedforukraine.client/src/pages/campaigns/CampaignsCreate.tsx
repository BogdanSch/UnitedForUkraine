import { FC } from "react";
import { SectionHeadline } from "../../components";
import { CreateCampaignsForm } from "../../containers";

const CampaignsCreate: FC = () => {
  return (
    <section className="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <SectionHeadline
            title={"Create a new Campaign"}
            sectionIndicatorTitle={"Campaigns"}
            className="mb-5"
          />
          <CreateCampaignsForm />
        </div>
      </div>
    </section>
  );
};

export default CampaignsCreate;
