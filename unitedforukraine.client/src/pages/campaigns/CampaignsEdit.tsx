import { FC } from "react";
import { useParams } from "react-router-dom";
import { SectionHeadline } from "../../components";
import { EditCampaignForm } from "../../containers";

const CampaignsEdit: FC = () => {
  let { id } = useParams();

  return (
    <section className="campaigns">
      <div className="container">
        <div className="campaigns__wrap">
          <SectionHeadline
            title={"Edit the existing Campaign"}
            sectionIndicatorTitle={"Campaigns"}
            className="mb-5"
          />
          <EditCampaignForm id={Number(id)} />
        </div>
      </div>
    </section>
  );
};

export default CampaignsEdit;
