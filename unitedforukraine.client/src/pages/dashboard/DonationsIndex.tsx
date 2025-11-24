import { FC } from "react";
import { DonationsTable } from "../../containers";
import { SectionHeadline } from "../../components";
import { useSearchParams } from "react-router-dom";

const DonationsIndex: FC = () => {
  const [searchParams] = useSearchParams();
  const campaignId: string | null = searchParams.get("campaignId");
  let userId: string | null = searchParams.get("userId");
  if (userId !== null) userId = encodeURIComponent(userId);

  return (
    <section className="lab mt-5" id="lab">
      <div className="container">
        <div className="lab__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Dashboard"
            title="Donations"
            headingClassName="heading"
          />
          <DonationsTable userId={userId} campaignId={campaignId} />
        </div>
      </div>
    </section>
  );
};

export default DonationsIndex;
