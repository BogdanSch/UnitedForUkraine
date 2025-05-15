import { FC, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../variables";
import { UserStatistics } from "../../types";
import AuthContext from "../../contexts/AuthContext";
import { formatMoney } from "../../utils/currency";
import formatNumber from "../../utils/formatNumber";

const UserStatisticsList: FC = () => {
  const { user, authToken } = useContext(AuthContext);

  const [statistics, setStatistics] = useState<UserStatistics>({
    donationsCount: 0,
    totalDonationsAmount: 0,
    averageDonationsAmount: 0,
    supportedCampaignsCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/donations/statistics/${user?.id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setStatistics(
          data || {
            donationsCount: 0,
            totalDonationsAmount: 0,
            averageDonationsAmount: 0,
            supportedCampaignsCount: 0,
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <ul className="statistics__list mt-4">
        <li className="statistics__item card card-border p-3">
          <div className="statistics__item-group">
            <i className="bi bi-currency-exchange"></i>
            <h4 className="statistics__item-title">Total Donations Received</h4>
          </div>
          <p className="statistics__item-amount">
            {formatMoney(statistics.totalDonationsAmount)}{" "}
            <span className="currency">UAH</span>
          </p>
        </li>
        <li className="statistics__item card card-border p-3">
          <div className="statistics__item-group">
            <i className="bi bi-card-checklist"></i>
            <h4 className="statistics__item-title">Total Donations Number</h4>
          </div>
          <p className="statistics__item-amount">
            {formatNumber(statistics.donationsCount)}+
          </p>
        </li>
        <li className="statistics__item card card-border p-3">
          <div className="statistics__item-group">
            <i className="bi bi-arrow-left-right"></i>
            <h4 className="statistics__item-title">Average Donation</h4>
          </div>
          <p className="statistics__item-amount">
            {formatMoney(statistics.averageDonationsAmount)}{" "}
            <span className="currency">UAH</span>
          </p>
        </li>
        <li className="statistics__item card card-border p-3">
          <div className="statistics__item-group">
            <i className="bi bi-people"></i>
            <h4 className="statistics__item-title">
              Supported Campaigns Count
            </h4>
          </div>
          <p className="statistics__item-amount">
            {formatNumber(statistics.supportedCampaignsCount)}+
          </p>
        </li>
      </ul>
    </>
  );
};

export default UserStatisticsList;
