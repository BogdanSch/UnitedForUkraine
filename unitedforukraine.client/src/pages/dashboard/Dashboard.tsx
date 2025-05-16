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

  //   if (!user) return;

  return (
    <>
      <section className="dashboard" id="dashboard">
        <div className="container">
          <div className="dashboard__wrap">
            <SectionHeadline
              className={`dashboard__headline`}
              title={`Welcome, customer`}
              sectionIndicatorTitle={`We've missed you so much.`}
            />
            <h2 className="dashboard__title">
              <span className="decoration">{user?.userName}!</span>
            </h2>
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
            {/* <article className="campaigns-detail__header"> */}
            <SectionHeadline
              title={`Donations overview`}
              sectionIndicatorTitle={``}
            />
            <UserDonationsList />
            {/* </article> */}
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
              title={`Supported campaigns`}
              sectionIndicatorTitle={``}
            />
            <UserSupportedCampaignsList />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
