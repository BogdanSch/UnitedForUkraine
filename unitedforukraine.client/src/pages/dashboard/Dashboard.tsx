import { FC, useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import {
  DonationsList,
  CampaignsList,
  UserStatisticsList,
} from "../../containers";
import { Alert, Card, SectionHeadline } from "../../components";

const Dashboard: FC = () => {
  const location = useLocation();
  const message: string = location.state?.message || "";
  const { user, isAdmin } = useContext(AuthContext);

  return (
    <>
      <section className="dashboard" id="dashboard">
        <div className="container">
          <div className="dashboard__wrap">
            {message && <Alert className="mb-3" message={message} />}
            <div className="text-content text-center mb-4">
              <h2 className="heading dashboard__title">
                Welcome, <span className="decoration">{user?.userName}!</span>
              </h2>
              <p className="dashboard__description">
                We're glad to have you back! Here you can view and edit your
                profile details, track the statistics of your donations, and
                explore the campaigns you've supported.
              </p>
            </div>
            <Card className="px-5 py-4" isLite={false}>
              <div className="mb-3">
                <a className="dashboard__link" href="/dashboard/update">
                  Update profile info
                </a>
              </div>
              <ul className="dashboard__list">
                <li className="dashboard__item">
                  Your email address: <strong>{user?.email}</strong>
                </li>
                <li className="dashboard__item">
                  Your contact number:{" "}
                  <strong>{user?.phoneNumber ?? "Unknown"}</strong>
                </li>
                {user?.address && (
                  <>
                    <li className="dashboard__item">
                      Your country:{" "}
                      <strong>{user.address.country || "Unknown"}</strong>
                    </li>
                    <li className="dashboard__item">
                      Your region:{" "}
                      <strong>{user.address.region || "Unknown"}</strong>
                    </li>
                    <li className="dashboard__item">
                      Your city:{" "}
                      <strong>{user.address.city || "Unknown"}</strong>
                    </li>
                    <li className="dashboard__item">
                      Your street:{" "}
                      <strong>{user.address.street || "Unknown"}</strong>
                    </li>
                    <li className="dashboard__item">
                      Your postal code:{" "}
                      <strong>{user.address.postalCode || "Unknown"}</strong>
                    </li>
                  </>
                )}
              </ul>
            </Card>
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
      <section className="dashboard dashboard--overview" id="dashboardOverview">
        <div className="container">
          <div className="dashboard__wrap">
            {isAdmin() && (
              <div className="mt-5 text-center">
                <h2 className="sub-heading dashboard__title">
                  Overview of all foundation donations
                </h2>
                <DonationsList
                  showUserDonations={false}
                  showQueryCriteria={true}
                />
              </div>
            )}
            <div className="mt-5 text-center">
              <h2 className="sub-heading dashboard__title">
                Your donations overview
              </h2>
              <p className="dashboard__description">
                Each donation of yours makes a great contribution into our
                victory
              </p>
              <DonationsList
                showUserDonations={true}
                showQueryCriteria={true}
              />
            </div>
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
            <CampaignsList
              showPaginationButtons={true}
              showQueryCriteria={false}
              showUserCampaigns={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
