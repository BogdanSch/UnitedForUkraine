import { FC, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import {
  UserDonationsList,
  UserStatisticsList,
  UserSupportedCampaignsList,
} from "../../containers";
import { SectionHeadline } from "../../components";

const Dashboard: FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      <section className="dashboard" id="dashboard">
        <div className="container">
          <div className="dashboard__wrap">
            <div className="text-content text-center mb-4">
              <h2 className="dashboard__title">
                Welcome, <span className="decoration">{user?.userName}!</span>
              </h2>
              <h3 className="dashboard__title">We've missed you so much!</h3>
            </div>
            <ul className="dashboard__list card px-5 py-4">
              <li className="dashboard__item">{user?.email}</li>
              <li className="dashboard__item">
                Your contact number:{" "}
                <strong>{user?.phoneNumber ?? "None"}</strong>
              </li>
              <li className="dashboard__item">
                Your location:
                {user?.address ? (
                  <ul className="dashboard__sub-list">
                    <li className="dashboard__sub-item">
                      {user?.address?.country}
                    </li>
                    <li className="dashboard__sub-item">
                      {user?.address?.city}
                    </li>
                    <li className="dashboard__sub-item">
                      {user?.address?.street}
                    </li>
                  </ul>
                ) : (
                  <strong>None</strong>
                )}
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="dashboard statistics" id="dashboardStatistics">
        <div className="container">
          <div className="dashboard__wrap">
            <SectionHeadline
              title={`We've gathered some basic statistics about your donations`}
              sectionIndicatorTitle={`Donations statistics`}
            />
            <UserStatisticsList />
          </div>
        </div>
      </section>
      <section
        className="dashboard campaigns-detail dashboard--overview"
        id="dashboardOverview"
      >
        <div className="container">
          <div className="dashboard__wrap text-center">
            <SectionHeadline
              title={`Every you donation brings our victory closer`}
              sectionIndicatorTitle={`Donations overview`}
            />
            <UserDonationsList />
          </div>
        </div>
      </section>
      <section
        className="dashboard campaigns dashboard--campaigns"
        id="dashboardCampaigns"
      >
        <div className="container">
          <div className="dashboard__wrap">
            <SectionHeadline
              title={`These campaigns were supported by you. We're so grateful for your cooperation!`}
              sectionIndicatorTitle={`Supported campaigns`}
            />
            <UserSupportedCampaignsList />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
