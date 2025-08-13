import axios from "axios";
import { protectedAxios } from "../../utils/axiosInstances";
import { ChangeEvent, FC, useContext, useEffect, useState } from "react";
import { API_URL } from "../../variables";
import AuthContext from "../../contexts/AuthContext";
import { DonationDto } from "../../types";
import { convertDonationCurrencyToString } from "../../utils/helpers/donationHelper";
import { handleSelectWithDataTagChange } from "../../hooks/useCustomForm";

interface IDonationListProps {
  campaignId?: number;
  showUserDonations: boolean;
  showQueryCriteria: boolean;
}

const DonationsList: FC<IDonationListProps> = ({
  campaignId,
  showUserDonations,
  showQueryCriteria,
}) => {
  const { user } = useContext(AuthContext);

  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("date_dsc");
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [currentDonationsPage, setCurrentDonationsPage] = useState<number>(1);

  useEffect(() => {
    let requestUrl: string;

    if (campaignId) {
      requestUrl = `${API_URL}/donations/campaign/${campaignId}?page=${currentDonationsPage}`;
    } else if (showUserDonations && user) {
      requestUrl = `${API_URL}/donations/user/${user.id}?page=${currentDonationsPage}&sortOrder=${sortOrder}`;
    } else {
      requestUrl = `${API_URL}/donations?page=${currentDonationsPage}&sortOrder=${sortOrder}`;
    }

    const fetchDonationsData = async () => {
      const options: Record<string, any> = {
        method: "GET",
        url: requestUrl,
      };

      if (showUserDonations && !user) {
        return;
      }

      let axiosInstance = showUserDonations ? protectedAxios : axios;

      try {
        const { data } = await axiosInstance.request(options);

        console.log(data);
        setDonations([...donations, ...data.donations]);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDonationsData();
  }, [currentDonationsPage, sortOrder]);

  const handleSortOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentDonationsPage(1);
    setDonations([]);
    handleSelectWithDataTagChange(event, setSortOrder);
  };

  return (
    <>
      {showQueryCriteria && (
        <form className="donations__query">
          <div className="donations__query-container">
            <div className="donations__query-group">
              <label
                className="form-label donations__query-label"
                htmlFor="sortOrder"
              >
                Select how to sort:{" "}
              </label>
              <select
                className="form-select donations__query-filter"
                id="sortOrder"
                name="sortOrder"
                onChange={handleSortOrderChange}
              >
                <option data-value="date_dsc">Most Recent</option>
                <option data-value="amount_dsc">Biggest Amount</option>
                <option data-value="amount_asc">Smallest Amount</option>
                {!showUserDonations && (
                  <option data-value="userName_asc">User Name A-Z</option>
                )}
              </select>
            </div>
          </div>
        </form>
      )}
      <ul className="donations-list mt-4">
        {donations.length > 0 ? (
          donations.map((donation: DonationDto) => (
            <li
              className="donations-list__item card p-3"
              key={`donations-${donation.id}`}
            >
              <div className="donations-list__item-userInfo">
                <span className="donations-list__item-date">
                  {donation.paymentDate}
                </span>
                <strong className="ms-2">{donation.userName}</strong>
              </div>
              <div className="donations-list__item-amount">
                <span>
                  +{donation.amount}
                  {` `}
                  {convertDonationCurrencyToString(donation.currency)}
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center mt-4">
            There are no donations yet. But you can change this situation by
            supporting one of our campaigns!
          </p>
        )}
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
    </>
  );
};

export default DonationsList;
