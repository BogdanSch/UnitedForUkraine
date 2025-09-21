import { FC } from "react";
import { SectionHeadline } from "../../components";
import { CreateCampaignsForm } from "../../containers";

const CampaignsCreate: FC = () => {
  return (
    <section className="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <SectionHeadline
            className="mb-5"
            title="Create a new News Update"
            sectionIndicatorTitle="News"
            description=""
          />
          <CreateCampaignsForm />
        </div>
      </div>
    </section>
  );
};

export default CampaignsCreate;
