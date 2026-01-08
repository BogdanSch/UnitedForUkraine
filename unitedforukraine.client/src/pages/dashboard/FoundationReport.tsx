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
            <p className="dashboard__description mb-2">
              Generate official foundation reports for selected periods. Reports
              include:
            </p>
            <ul className="dashboard__features-list">
              <li className="dashboard__features-item">Donations summary</li>
              <li className="dashboard__features-item">Campaign performance</li>
              <li className="dashboard__features-item">Currency breakdown</li>
              <li className="dashboard__features-item">Export-ready format</li>
            </ul>
          </div>
          <FoundationReportForm />
        </div>
      </div>
    </section>
  );
};

export default FoundationReport;
