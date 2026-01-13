import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Card } from "../../components";
import { CampaignStatistics } from "../../types";
import { API_URL } from "../../variables";
import formatNumber from "../../utils/helpers/formatNumber";

interface ICampaignStatisticsListProps {
  id: number;
}
const getDefaultData = (): CampaignStatistics => ({
  donationsCount: 0,
  newsUpdatesCount: 0,
  repeatDonorRate: 0,
  likesCount: 0,
});

const CampaignStatisticsList: FC<ICampaignStatisticsListProps> = ({ id }) => {
  const [statistics, setStatistics] = useState<CampaignStatistics>(
    getDefaultData()
  );

  useEffect(() => {
    axios
      .get<CampaignStatistics>(`${API_URL}/campaigns/${id}/statistics`)
      .then((response) => {
        console.log("Campaign statistics data: " + response.data);
        setStatistics(response.data || getDefaultData());
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <ul className="statistics__list mt-4">
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-currency-exchange"></i>
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
            <i className="statistics__item-icon bi bi-card-checklist"></i>
            <h4 className="sub-heading statistics__item-title">
              Total News updates Number
            </h4>
          </div>
          <p className="statistics__item-amount">
            {formatNumber(statistics.newsUpdatesCount)}+
          </p>
        </Card>
      </li>
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-bar-chart"></i>
            <h4 className="sub-heading statistics__item-title">
              Repeat Donor Rate
            </h4>
          </div>
          <p className="statistics__item-amount">
            {statistics.repeatDonorRate}
            <span className="currency">%</span>
          </p>
        </Card>
      </li>
      <li className="statistics__item">
        <Card className="card-border p-3" isLite={false}>
          <div className="statistics__item-group">
            <i className="statistics__item-icon bi bi-hearts"></i>
            <h4 className="sub-heading statistics__item-title">Likes Number</h4>
          </div>
          <p className="statistics__item-amount">{statistics.likesCount}</p>
        </Card>
      </li>
    </ul>
  );
};

export default CampaignStatisticsList;
