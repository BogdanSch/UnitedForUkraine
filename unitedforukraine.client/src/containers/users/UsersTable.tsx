import axios from "axios";
import { type FC, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Paginator } from "../../components";
import { PaginatedUsersDto, UserDto } from "../../types";
import { API_URL } from "../../variables";

type UsersTableTableProps = {
  showPaginationButtons: boolean;
};

const UsersTable: FC<UsersTableTableProps> = ({ showPaginationButtons }) => {
  const [paginatedUsers, setPaginatedUsers] = useState<PaginatedUsersDto>({
    users: [],
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
      let requestUrl: string = `${API_URL}/Auth/users?page=${currentPage}&sortOrder=${sortOrder}`;

      try {
        const { data } = await axios.get<PaginatedUsersDto>(requestUrl);
        console.log(data);
        setPaginatedUsers(data);
      } catch (error) {
        console.log(`Error fetching campaigns: ${error}`);
      }
    };

    fetchData();
  }, [page, sortOrder]);

  return (
    <>
      {paginatedUsers.users.length > 0 ? (
        <div className="table-wrap">
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">Ідентифікатор користувача</th>
                <th scope="col">Електронна пошта</th>
                <th scope="col">Номер телефону</th>
                <th scope="col">Дата реєстрації</th>
                <th scope="col">Ім'я</th>
                <th scope="col">Ідентифікатор адреси</th>
                <th scope="col">Країна</th>
                <th scope="col">Регіон</th>
                <th scope="col">Місто</th>
                <th scope="col">Вулиця</th>
                <th scope="col">Поштовий індекс</th>
                {/* <th scope="col">Перегляд донатів користувача</th> */}
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.users.map((user: UserDto) => (
                <tr key={user.id}>
                  <th scope="row">{user.id}</th>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.registeredAt}</td>
                  <td>{user.userName}</td>
                  <td>{user.address.id}</td>
                  <td>{user.address.country}</td>
                  <td>{user.address.region}</td>
                  <td>{user.address.city}</td>
                  <td>{user.address.street}</td>
                  <td>{user.address.postalCode}</td>
                  {/* <td>
                    <a
                      className="btn btn-light"
                      href={`/labs/donations?userId=${encodeURIComponent(
                        user.id
                      )}`}
                    >
                      Переглянути
                    </a>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No users have been found.</p>
      )}
      {showPaginationButtons &&
        paginatedUsers.users.length > 0 &&
        paginatedUsers.hasNextPage &&
        paginatedUsers.hasPreviousPage && (
          <Paginator
            linkPath={"/users"}
            currentPageIndex={pageIndex}
            hasPreviousPage={paginatedUsers.hasPreviousPage}
            hasNextPage={paginatedUsers.hasNextPage}
          />
        )}
    </>
  );
};

export default UsersTable;
