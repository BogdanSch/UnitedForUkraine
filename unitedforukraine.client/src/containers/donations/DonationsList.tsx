import axios from "axios";
import { protectedAxios } from "../../utils/axiosInstances";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_URL, LOAD_MORE_SELECT_VALUE } from "../../variables";
import AuthContext from "../../contexts/AuthContext";
import useCustomForm, {
  handleSelectWithDataTagChange,
} from "../../hooks/useCustomForm";
import { Alert, Input } from "../../components";
import { DeleteDonationForm } from "..";
import {
  DonationDto,
  PaginatedCampaignsDto,
  PaginatedDonationsDto,
  DateRange,
} from "../../types";
import { Currency } from "../../types/enums";
import {
  convertDonationCurrencyToString,
  convertDonationStatusToString,
} from "../../utils/helpers/donationHelper";
import { fetchAllActiveAndCompletedCampaigns } from "../../utils/services/campaignService";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";

interface IDonationsListProps {
  name: string;
  campaignId?: number;
  showUserDonations: boolean;
  showQueryCriteria: boolean;
}

const getDefaultPaginatedDonations = (): PaginatedDonationsDto => ({
  donations: [],
  hasNextPage: false,
});

const DonationsList: FC<IDonationsListProps> = ({
  name,
  campaignId,
  showUserDonations,
  showQueryCriteria,
}) => {
  const { user, isAdmin } = useContext(AuthContext);
  const isAdminView: boolean = isAdmin();

  const [paginatedDonations, setPaginatedDonations] =
    useState<PaginatedDonationsDto>(getDefaultPaginatedDonations());
  const [paginatedCampaigns, setPaginatedCampaigns] =
    useState<PaginatedCampaignsDto>({
      campaigns: [],
      hasNextPage: false,
      hasPreviousPage: false,
    });
  const [deleteMessage, setDeleteMessage] = useState<string>("");

  const [currentDonationsPage, setCurrentDonationsPage] = useState<number>(1);
  const [campaignPageIndex, setCampaignPageIndex] = useState<number>(1);
  const [sortOrder, setSortOrder] = useState<string>("date_dsc");
  const [currencies, setCurrencies] = useState<string>("");
  const [campaignIds, setCampaignIds] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });

  const { handleDateChangeWithCallback } = useCustomForm(setDateRange);
  const { handleSelectChange } = useCustomForm(setCampaignIds);

  useEffect(() => {
    let requestUrl: string;
    if (campaignId) {
      requestUrl = `${API_URL}/donations/campaign/${campaignId}?page=${currentDonationsPage}`;
    } else if (showUserDonations && user) {
      requestUrl = `${API_URL}/donations/user/${user.id}?page=${currentDonationsPage}`;
    } else {
      requestUrl = `${API_URL}/donations?page=${currentDonationsPage}`;
    }
    requestUrl += sortOrder ? `&sortOrder=${sortOrder}` : "";
    requestUrl += currencies ? `&currencies=${currencies}` : "";
    requestUrl += campaignIds ? `&campaignIds=${campaignIds}` : "";
    if (
      !isNullOrWhitespace(dateRange.startDate) &&
      !isNullOrWhitespace(dateRange.endDate)
    )
      requestUrl += `&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;

    const fetchDonationsData = () => {
      if (showUserDonations && !user) return;

      let axiosInstance = showUserDonations ? protectedAxios : axios;

      axiosInstance
        .get<PaginatedDonationsDto>(requestUrl)
        .then((response) => {
          console.log(response.data);

          setPaginatedDonations((prev) => {
            const uniqueNewDonations = response.data.donations.filter(
              (newDonation) =>
                !prev.donations.some(
                  (existingDonation) => existingDonation.id === newDonation.id
                )
            );
            return {
              donations: [...prev.donations, ...uniqueNewDonations],
              hasNextPage: response.data.hasNextPage,
            };
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchDonationsData();
  }, [currentDonationsPage, sortOrder, currencies, campaignIds, dateRange]);

  useEffect(() => {
    fetchAllActiveAndCompletedCampaigns(campaignPageIndex)
      .then((data) => {
        setPaginatedCampaigns({
          campaigns: paginatedCampaigns.campaigns.concat(data.campaigns),
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage,
        });
      })
      .catch((error) => {
        console.log(`Error fetching  campaigns: ${error}`);
      });
  }, [campaignPageIndex]);

  const resetDonationsList = () => {
    setCurrentDonationsPage(1);
    setPaginatedDonations(getDefaultPaginatedDonations());
  };
  const handleChangeWithDonationsReset = (
    event: ChangeEvent<HTMLSelectElement>,
    setter: Dispatch<SetStateAction<string>>
  ) => {
    resetDonationsList();
    handleSelectWithDataTagChange(event, setter);
  };
  const loadMoreCompletedCampaigns = async (): Promise<void> => {
    if (paginatedCampaigns.hasNextPage)
      setCampaignPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

  return (
    <>
      {deleteMessage && <Alert message={deleteMessage} />}
      {showQueryCriteria && (
        <form className="query">
          <div className="query__container">
            <div className="query__group">
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor={`sortOrder-${name}`}
                >
                  Select how to sort:
                </label>
                <select
                  className="form-select query__filter"
                  id={`sortOrder-${name}`}
                  name="sortOrder"
                  onChange={(e) =>
                    handleChangeWithDonationsReset(e, setSortOrder)
                  }
                >
                  <option data-value="date_dsc" value="date_dsc">
                    Most Recent
                  </option>
                  <option data-value="amount_dsc" value="amount_dsc">
                    Biggest Amount
                  </option>
                  <option data-value="amount_asc" value="amount_asc">
                    Smallest Amount
                  </option>
                  <option data-value="userName_asc" value="userName_asc">
                    User Name A-Z
                  </option>
                </select>
              </div>
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor={`currenciesFilter-${name}`}
                >
                  Select currency:
                </label>
                <select
                  className="form-select query__filter"
                  name="currencies"
                  id={`currenciesFilter-${name}`}
                  onChange={(e) =>
                    handleChangeWithDonationsReset(e, setCurrencies)
                  }
                >
                  <option value="" data-value="">
                    All Currencies
                  </option>
                  {Object.keys(Currency)
                    .filter((key) => !isNaN(Number(Currency[key as any])))
                    .map((key, index) => (
                      <option
                        key={key}
                        value={Currency[key as keyof typeof Currency]}
                        data-value={index}
                      >
                        {key}
                      </option>
                    ))}
                </select>
              </div>
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor={`campaignsFilter-${name}`}
                >
                  Select campaign:
                </label>
                <select
                  className="form-select query__filter"
                  name="campaignIds"
                  id={`campaignsFilter-${name}`}
                  value={campaignIds}
                  onChange={(e) =>
                    handleSelectChange(
                      e,
                      false,
                      resetDonationsList,
                      loadMoreCompletedCampaigns
                    )
                  }
                >
                  <option value="" data-value="">
                    All Campaigns
                  </option>
                  {paginatedCampaigns.campaigns.map((campaign) => {
                    return (
                      <option key={campaign.title} value={campaign.id}>
                        {campaign.title}
                      </option>
                    );
                  })}
                  <option
                    id="loadMoreOption"
                    value={LOAD_MORE_SELECT_VALUE}
                    disabled={!paginatedCampaigns.hasNextPage}
                  >
                    Load more
                  </option>
                </select>
              </div>
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor={`startDate-${name}`}
                >
                  Select period to filter:{" "}
                </label>
                <div className="query__item-dates">
                  <Input
                    type="date"
                    className="form-control"
                    id={`startDate-${name}`}
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      handleDateChangeWithCallback(e, resetDonationsList)
                    }
                    placeholder="Period start date"
                    isRequired={false}
                  />
                  <Input
                    type="date"
                    className="form-control"
                    id={`endDate-${name}`}
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      handleDateChangeWithCallback(e, resetDonationsList)
                    }
                    placeholder="Period end date"
                    isRequired={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
      {paginatedDonations.donations.length > 0 ? (
        <ul className="donations-list mt-4">
          {paginatedDonations.donations.map((donation: DonationDto) => {
            const isNoteAvailable: boolean = !isNullOrWhitespace(
              donation.notes
            );

            return (
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
                {(isAdminView || isNoteAvailable) && (
                  <div className="donations-list__item-extra">
                    {isAdminView && (
                      <p>
                        Donation status:{" "}
                        <strong>
                          {convertDonationStatusToString(donation.status)}
                        </strong>
                      </p>
                    )}
                    {isNoteAvailable && (
                      <p>
                        Message: <strong>{donation.notes}</strong>
                      </p>
                    )}
                  </div>
                )}
                {isAdminView && (
                  <div className="donations-list__item-actions">
                    <DeleteDonationForm
                      id={donation.id}
                      setPaginatedDonations={setPaginatedDonations}
                      setMessage={setDeleteMessage}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 text-center">
          There are no donations yet. But you can change this situation by
          supporting one of our campaigns!
        </p>
      )}
      {paginatedDonations.donations.length > 0 && (
        <button
          className={`btn btn-secondary ${
            paginatedDonations.hasNextPage ? "" : "disabled"
          }`}
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
