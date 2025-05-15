import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import { API_URL } from "../../variables";
import AuthContext from "../../contexts/AuthContext";
import { DonationDto } from "../../types";
import { convertDonationCurrencyToString } from "../../utils/donationHelper";

const CampaignDonationsList: FC = () => {
  const { user, authToken } = useContext(AuthContext);

  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [currentDonationsPage, setCurrentDonationsPage] = useState<number>(1);

  useEffect(() => {
    const fetchDonationsData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/donations/user/${user?.id}?page=${currentDonationsPage}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setDonations([...donations, ...data.donations]);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        console.error(error);
      }
    };

    if (!user) return;
    fetchDonationsData();
  }, [currentDonationsPage]);

  return (
    <div className="campaigns-detail__donations">
      <ul className="campaigns-detail__donations-list">
        {donations.map((donation: DonationDto) => (
          <li
            className="campaigns-detail__donations-item card p-3"
            key={`donations-${donation.id}`}
          >
            <div className="campaigns-detail__donations-item-userInfo">
              <span className="campaigns-detail__donations-item-date">
                {donation.paymentDate}
              </span>
              <strong className="ms-2">{donation.userName}</strong>
            </div>
            <div className="campaigns-detail__donations-item-amount">
              <span>
                +{donation.amount}
                {` `}
                {convertDonationCurrencyToString(donation.currency)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {donations.length > 0 && (
        <button
          className={`btn btn-secondary ${hasNextPage ? "" : "disabled"}`}
          onClick={() => {
            setCurrentDonationsPage(currentDonationsPage + 1);
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
};

export default CampaignDonationsList;
