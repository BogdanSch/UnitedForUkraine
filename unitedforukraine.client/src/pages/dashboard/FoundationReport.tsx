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
          <div className="dashboard__intro">
            <p className="dashboard__description">
              Generate official foundation reports for selected periods. Reports
              include donations, campaigns, and financial summaries.
            </p>
            <ul className="dashboard__features">
              <li>✔ Donations summary</li>
              <li>✔ Campaign performance</li>
              <li>✔ Currency breakdown</li>
              <li>✔ Export-ready format</li>
            </ul>
          </div>
          <FoundationReportForm />
        </div>
      </div>
    </section>
  );
};

export default FoundationReport;
