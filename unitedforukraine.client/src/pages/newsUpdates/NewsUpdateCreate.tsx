import { FC } from "react";
import { SectionHeadline } from "../../components";
import { CreateNewsUpdateForm } from "../../containers";

const CampaignsCreate: FC = () => {
  return (
    <section className="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <SectionHeadline
            className="mb-5"
            title="Create a new News Update"
            sectionIndicatorTitle="News"
            description="Fill out the form below to add a new news update to the catalog."
          />
          <CreateNewsUpdateForm />
        </div>
      </div>
    </section>
  );
};

export default CampaignsCreate;
