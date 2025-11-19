import axios from "axios";
import { FC, useEffect, useState } from "react";
import { API_URL } from "../../variables";
import { Statistics } from "../../types";

import { Card } from "../../components";
import { formatMoney } from "../../utils/helpers/currencyHelper";
import formatNumber from "../../utils/helpers/formatNumber";

const getDefaultStatistics = (): Statistics => ({
  donationsCount: 0,
  campaignsCount: 0,
  totalDonationsAmount: 0,
  mostFrequentDonationAmount: 0,
  averageDonationsAmount: 0,
  uniqueDonorsCount: 0,
  cityWithMostDonations: "",
  mostFrequentDonorName: "",
  donationsGrowthRate: 0,
});

const FoundationStatisticsList: FC = () => {
  const [statistics, setStatistics] = useState<Statistics>(
    getDefaultStatistics()
  );

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/donations/statistics`,
      };

      try {
        const { data } = await axios.request(options);
        console.log(data);
        setStatistics(data || getDefaultStatistics());
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul className="statistics__list mt-4">
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon  bi bi-currency-exchange"></i>
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
            <i className="statistics__item-icon  bi bi-currency-exchange"></i>
            <h4 className="sub-heading statistics__item-title">
              Total Campaigns Created
            </h4>
          </div>
          <p className="statistics__item-amount">
            {formatNumber(statistics.campaignsCount)}+
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
            <i className="statistics__item-icon bi bi-people"></i>
            <h4 className="sub-heading statistics__item-title">
              Unique Donors
            </h4>
          </div>
          <p className="statistics__item-amount">
            {formatNumber(statistics.uniqueDonorsCount)}+
          </p>
        </Card>
      </li>
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-balloon-heart"></i>
            <h4 className="sub-heading statistics__item-title">
              Most Frequent Donation
            </h4>
          </div>
          <p className="statistics__item-amount">
            {formatMoney(statistics.mostFrequentDonationAmount)}{" "}
            <span className="currency">UAH</span>
          </p>
        </Card>
      </li>
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-house-up-fill"></i>
            <h4 className="sub-heading statistics__item-title">
              City with Most Donations
            </h4>
          </div>
          <p className="statistics__item-amount">
            {statistics.cityWithMostDonations}
          </p>
        </Card>
      </li>
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-person-hearts"></i>
            <h4 className="sub-heading statistics__item-title">
              Our Most Frequent Donor
            </h4>
          </div>
          <p className="statistics__item-amount">
            {statistics.mostFrequentDonorName}
          </p>
        </Card>
      </li>
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-graph-up-arrow"></i>
            <h4 className="sub-heading statistics__item-title">
              Donations Growth Rate
            </h4>
          </div>
          <p className="statistics__item-amount">
            {statistics.donationsGrowthRate.toFixed(2)}%
          </p>
        </Card>
      </li>
    </ul>
  );
};

export default FoundationStatisticsList;
