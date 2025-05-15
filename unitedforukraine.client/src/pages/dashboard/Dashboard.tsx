import { FC, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { UserDonationsList, UserStatisticsList } from "../../containers";

const Dashboard: FC = () => {
  const { user } = useContext(AuthContext);

  //   if (!user) return;

  return (
    <>
      <section className="dashboard dashboard--profile" id="dashboard">
        <div className="container">
          <div className="dashboard__wrap">
            <h2 className="dashboard__title">
              Welcome,{" "}
              <span className="text-decoration">{user?.userName}!</span>
              We've missed you so much.
            </h2>
            <ul className="dashboard__list card px-4 py-2">
              <li className="dashboard__item">{user?.email}</li>
              <li className="dashboard__item">
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
      <section
        className="dashboard statistics dashboard--statistics"
        id="dashboardStatistics"
      >
        <div className="container">
          <div className="dashboard__wrap">
            <h2 className="dashboard__title">Donations statistics</h2>
            <UserStatisticsList />
          </div>
        </div>
      </section>
      <section className="dashboard dashboard--overview" id="dashboardOverview">
        <div className="container">
          <div className="dashboard__wrap">
            <h2 className="dashboard__title">Donations overview</h2>
            <UserDonationsList />
          </div>
        </div>
      </section>
      <section
        className="dashboard dashboard--campaigns"
        id="dashboardCampaigns"
      >
        <div className="container">
          <div className="dashboard__wrap">
            <h2 className="dashboard__title">Supported campaigns</h2>
            {/* <UserDonationsList /> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
