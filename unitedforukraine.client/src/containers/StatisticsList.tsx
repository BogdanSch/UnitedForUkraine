import { FC, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../variables";
import { Statistics } from "../types";

import { formatMoney } from "../utils/currency";
import formatNumber from "../utils/formatNumber";

const StatisticsList: FC = () => {
  const [statistics, setStatistics] = useState<Statistics>({
    donationsCount: 0,
    totalDonationsAmount: 0,
    averageDonationsAmount: 0,
    uniqueDonorsCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/Donation/statistics`,
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setStatistics(
          data || {
            donationsCount: 0,
            totalDonationsAmount: 0,
            averageDonationsAmount: 0,
            uniqueDonorsCount: 0,
          }
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
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
          <h4 className="statistics__item-title">Unique Donors</h4>
        </div>
        <p className="statistics__item-amount">
          {formatNumber(statistics.uniqueDonorsCount)}+
        </p>
      </li>
    </ul>
  );
};

export default StatisticsList;
