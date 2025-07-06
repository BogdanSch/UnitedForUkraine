import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { API_URL, UNDEFINED_DATE } from "../../variables";
import { UserStatistics } from "../../types";
import AuthContext from "../../contexts/AuthContext";
import formatNumber from "../../utils/formatNumber";
import { formatMoney } from "../../utils/helpers/currencyHelper";
import { convertToReadableDate } from "../../utils/dateConverter";
import { Card } from "../../components";

const DEFAULT_STATISTICS: UserStatistics = {
  donationsCount: 0,
  totalDonationsAmount: 0,
  averageDonationsAmount: 0,
  smallestDonationAmount: 0,
  biggestDonationAmount: 0,
  supportedCampaignsCount: 0,
  firstDonationDate: "",
  lastDonationDate: "",
};

const UserStatisticsList: FC = () => {
  const { user, authToken } = useContext(AuthContext);

  const [statistics, setStatistics] =
    useState<UserStatistics>(DEFAULT_STATISTICS);

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

        console.log("User statistics data: ");
        console.log(data);

        setStatistics(data || DEFAULT_STATISTICS);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <ul className="statistics__list mt-4">
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-currency-exchange"></i>
              <h4 className="sub-heading statistics__item-title">
                Total Donations Received
              </h4>
            </div>
            <p className="statistics__item-amount">
              {formatMoney(statistics.totalDonationsAmount)}{" "}
              <span className="currency">UAH</span>
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-card-checklist"></i>
              <h4 className="sub-heading statistics__item-title">
                Total Donations Number
              </h4>
            </div>
            <p className="statistics__item-amount">
              {formatNumber(statistics.donationsCount)}+
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-bar-chart"></i>
              <h4 className="sub-heading statistics__item-title">
                Smallest Donation
              </h4>
            </div>
            <p className="statistics__item-amount">
              {formatMoney(statistics.smallestDonationAmount)}{" "}
              <span className="currency">UAH</span>
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-arrow-left-right"></i>
              <h4 className="sub-heading statistics__item-title">
                Average Donation
              </h4>
            </div>
            <p className="statistics__item-amount">
              {formatMoney(statistics.averageDonationsAmount)}{" "}
              <span className="currency">UAH</span>
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-bar-chart-steps"></i>
              <h4 className="sub-heading statistics__item-title">
                Biggest Donation
              </h4>
            </div>
            <p className="statistics__item-amount">
              {formatMoney(statistics.biggestDonationAmount)}{" "}
              <span className="currency">UAH</span>
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-envelope-check"></i>
              <h4 className="sub-heading statistics__item-title">
                Supported Campaigns Count
              </h4>
            </div>
            <p className="statistics__item-amount">
              {formatNumber(statistics.supportedCampaignsCount)}+
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-envelope-check"></i>
              <h4 className="sub-heading statistics__item-title">
                First Donation Date
              </h4>
            </div>
            <p className="statistics__item-amount">
              {statistics.firstDonationDate == UNDEFINED_DATE
                ? UNDEFINED_DATE
                : convertToReadableDate(statistics.firstDonationDate)}
            </p>
          </Card>
        </li>
        <li className="statistics__item">
          <Card className="card-border p-3" isLite={false}>
            <div className="statistics__item-group">
              <i className="statistics__item-icon bi bi-envelope-check"></i>
              <h4 className="sub-heading statistics__item-title">
                Last Donation Date
              </h4>
            </div>
            <p className="statistics__item-amount">
              {statistics.lastDonationDate == UNDEFINED_DATE
                ? UNDEFINED_DATE
                : convertToReadableDate(statistics.lastDonationDate)}
            </p>
          </Card>
        </li>
      </ul>
    </>
  );
};

export default UserStatisticsList;
