import axios from "axios";
import { FC, useEffect, useState } from "react";
import { API_URL } from "../../variables";
import { DonationDto } from "../../types";

interface IDonationsTableProps {
  campaignId?: number;
  userId?: string;
}

const DonationsTable: FC<IDonationsTableProps> = ({ campaignId, userId }) => {
  const [donations, setDonations] = useState<DonationDto[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("date_dsc");
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [currentDonationsPage, setCurrentDonationsPage] = useState<number>(1);

  useEffect(() => {
    let requestUrl: string;

    if (campaignId) {
      requestUrl = `${API_URL}/donations/campaign/${campaignId}?page=${currentDonationsPage}`;
    } else if (userId) {
      requestUrl = `${API_URL}/donations/user/${userId}?page=${currentDonationsPage}&sortOrder=${sortOrder}`;
    } else {
      requestUrl = `${API_URL}/donations?page=${currentDonationsPage}&sortOrder=${sortOrder}`;
    }

    const fetchDonationsData = async () => {
      try {
        const { data } = await axios.get<Record<string, any>>(requestUrl);

        console.log(data);
        setDonations([...donations, ...data.donations]);
        setHasNextPage(data.hasNextPage);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDonationsData();
  }, [currentDonationsPage, sortOrder]);

  return (
    <>
      {donations.length > 0 ? (
        <table className="table table-dark mt-4">
          <thead>
            <tr>
              <th scope="col">Ідентифікатор донату</th>
              <th scope="col">Сума</th>
              <th scope="col">Валюта</th>
              <th scope="col">Дата оплати</th>
              <th scope="col">Метод оплати</th>
              <th scope="col">Стан</th>
              <th scope="col">Побажання</th>
              <th scope="col">Номер сесії оплати</th>
              <th scope="col">Ідентифікатор користувача</th>
              <th scope="col">Ідентифікатор кампанії</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation: DonationDto) => (
              <tr key={`donations-${donation.id}`}>
                <td>{donation.id}</td>
                <td>{donation.amount}</td>
                <td>{donation.currency}</td>
                <td>{donation.paymentDate}</td>
                <td>{donation.paymentMethod}</td>
                <td>{donation.status}</td>
                <td>{donation.notes}</td>
                <td>{donation.checkoutSessionId}</td>
                <td>{donation.userId}</td>
                <td>{donation.campaignId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">
          There are no donations yet. But you can change this situation by
          supporting one of our campaigns!
        </p>
      )}
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

export default DonationsTable;
