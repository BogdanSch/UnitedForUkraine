import { FC } from "react";
import { FoundationReportForm } from "../../containers";
import { SectionHeadline } from "../../components";

const FoundationReport: FC = () => {
  return (
    <section className="dashboard mt-5">
      <div className="container">
        <div className="dashboard__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Dashboard"
            title="Report Generator"
            headingClassName="heading"
          />
          <FoundationReportForm />
        </div>
      </div>
    </section>
  );
};

export default FoundationReport;
