import axios from "axios";
import { type FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CampaignsPaginator } from "../../components";
import { CampaignDto, PaginatedCampaignsDto } from "../../types";
import { API_URL } from "../../variables";
import { convertToReadableDate } from "../../utils/helpers/dateHelper";

type UsersTableTableProps = {
  showPaginationButtons: boolean;
};

const UsersTable: FC<UsersTableTableProps> = ({ showPaginationButtons }) => {
  const [paginatedCampaigns, setPaginatedCampaigns] =
    useState<PaginatedCampaignsDto>({
      campaigns: [],
      hasNextPage: false,
      hasPreviousPage: false,
    });
  const [sortOrder] = useState<string>("date_dsc");
  const [pageIndex, setPageIndex] = useState<number>(1);

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    const currentPage: number = Number(page) > 0 ? Number(page) : 1;
    setPageIndex(currentPage);

    const fetchData = async () => {
      let requestUrl: string = `${API_URL}/campaigns?page=${currentPage}&sortOrder=${sortOrder}`;

      try {
        const { data } = await axios.get<PaginatedCampaignsDto>(requestUrl);
        setPaginatedCampaigns(data);
      } catch (error) {
        console.log(`Error fetching campaigns: ${error}`);
      }
    };

    fetchData();
  }, [page, sortOrder]);

  return (
    <>
      {paginatedCampaigns.campaigns.length > 0 ? (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Ідентифікатор кампанії</th>
              <th scope="col">Заголовок</th>
              <th scope="col">Гасло</th>
              <th scope="col">Опис</th>
              <th scope="col">Цільова кількість грошей</th>
              <th scope="col">Набрана кількість грошей</th>
              <th scope="col">Валюта</th>
              <th scope="col">Дата початку</th>
              <th scope="col">Дата закінчення</th>
              <th scope="col">Посилання на зображення обкладинки</th>
              <th scope="col">Стан</th>
              <th scope="col">Категорія</th>
              <th scope="col">Кількість донорів</th>
              <th scope="col">Перегляд донатів кампанії</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCampaigns.campaigns.map((campaign: CampaignDto) => (
              <tr key={campaign.id}>
                <th scope="row">{campaign.id}</th>
                <td>{campaign.title}</td>
                <td>{campaign.slogan}</td>
                <td>{campaign.description}</td>
                <td>{campaign.goalAmount}</td>
                <td>{campaign.raisedAmount}</td>
                <td>{campaign.currency}</td>
                <td>{convertToReadableDate(campaign.startDate)}</td>
                <td>{convertToReadableDate(campaign.endDate)}</td>
                <td>{campaign.imageUrl}</td>
                <td>{campaign.status}</td>
                <td>{campaign.category}</td>
                <td>{campaign.donorsCount}</td>
                <td>
                  <a href="">Переглянути</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No campaigns have been found.</p>
      )}
      {showPaginationButtons &&
        paginatedCampaigns.campaigns.length > 0 &&
        paginatedCampaigns.hasNextPage &&
        paginatedCampaigns.hasPreviousPage && (
          <CampaignsPaginator
            currentPageIndex={pageIndex}
            hasPreviousPage={paginatedCampaigns.hasPreviousPage}
            hasNextPage={paginatedCampaigns.hasNextPage}
          />
        )}
    </>
  );
};

export default UsersTable;
