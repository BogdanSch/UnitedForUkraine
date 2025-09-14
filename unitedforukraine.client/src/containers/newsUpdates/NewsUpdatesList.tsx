import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { handleSelectWithDataTagChange } from "../../hooks/useCustomForm";
import { Card, NewsUpdatesPaginator, SearchBar } from "../../components";
import { PaginatedNewsUpdatesDto } from "../../types";
import { API_URL } from "../../variables";
import { convertToReadableDate } from "../../utils/helpers/dateHelper";
import { convertToPreviewText } from "../../utils/helpers/stringHelper";

interface INewsUpdatesListProps {
  className?: string;
  showQueryCriteria: boolean;
  showPaginationButtons: boolean;
  [key: string]: any;
}

const DEFAULT_PAGINATED_NEWS_UPDATES: PaginatedNewsUpdatesDto = {
  newsUpdates: [],
  hasNextPage: false,
  hasPreviousPage: false,
};

const NewsUpdatesList: FC<INewsUpdatesListProps> = ({
  showQueryCriteria,
  showPaginationButtons,
  className = "",
  ...rest
}) => {
  const [paginatedNewsUpdates, setPaginatedNewsUpdates] =
    useState<PaginatedNewsUpdatesDto>(DEFAULT_PAGINATED_NEWS_UPDATES);
  // const [newsUpdates, setNewsUpdates] = useState<NewsUpdateDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("date_dsc");
  const [pageIndex, setPageIndex] = useState<number>(1);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchParams] = useSearchParams();
  const page = searchParams.get("page");

  const fetchNewsUpdates = async () => {
    try {
      let requestUrl: string = `${API_URL}/newsUpdates?page=${pageIndex}`;

      if (showQueryCriteria)
        requestUrl += `&searchedQuery=${searchQuery}&sortOrder=${sortOrder}`;

      const { data } = await axios.get<PaginatedNewsUpdatesDto>(requestUrl);
      setPaginatedNewsUpdates(data);
    } catch (error) {
      console.log("Error fetching news updates: ", error);
      setPaginatedNewsUpdates(DEFAULT_PAGINATED_NEWS_UPDATES);
    }
  };

  useEffect(() => {
    const currentPage: number = Number(page) > 0 ? Number(page) : 1;
    setPageIndex(currentPage);

    fetchNewsUpdates();
  }, [page, searchQuery, sortOrder]);

  const handleSearch = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const searchInput: HTMLInputElement | null = searchInputRef.current;

    if (!searchInput) return;
    setSearchQuery(searchInput.value);
  };

  return (
    <>
      {showQueryCriteria && (
        <form className="news__query" onSubmit={handleSearch}>
          <div className="news__query-container">
            <SearchBar className="news" searchInputReference={searchInputRef} />
            <div className="news__query-group">
              <select
                className="form-select news__query-filter"
                id="sortOrder"
                name="sortOrder"
                onChange={(e) => handleSelectWithDataTagChange(e, setSortOrder)}
              >
                <option data-value="date_dsc">Most Recent</option>
                <option data-value="date_asc">Most Latest</option>
                <option data-value="title_asc">Title</option>
                <option data-value="readingTime_asc">Fastest to read</option>
                <option data-value="readingTime_dsc">Longest to read</option>
                {/* <option data-value="nearEnd_dsc">Near End</option> */}
              </select>
            </div>
          </div>
        </form>
      )}
      <ul
        className={`news__list mt-5 ${
          className.trim().length > 0 ? " " + className : ""
        }`}
        {...rest}
      >
        {paginatedNewsUpdates.newsUpdates.length > 0 ? (
          paginatedNewsUpdates.newsUpdates.map((newsUpdate) => {
            return (
              <li key={newsUpdate.id} className="news__item">
                <Card
                  imageSrc={newsUpdate.imageUrl}
                  imageAlt={newsUpdate.title}
                  // cardStatus={convertCampaignStatusToString(campaign.status)}
                  isLite={false}
                >
                  <Link
                    to={`/newsUpdates/detail/${newsUpdate.id}/`}
                    className="news__item-link"
                  >
                    <h3 className="card-title">{newsUpdate.title}</h3>
                    <p className="card-text text-muted">
                      {convertToPreviewText(newsUpdate.content)}
                    </p>
                    <p className="card-text text-muted">
                      <strong>Reading Time:</strong>{" "}
                      {newsUpdate.readingTimeMinutes} minutes
                    </p>
                    <p className="card-text text-muted">
                      <strong>Posted At:</strong>{" "}
                      {convertToReadableDate(newsUpdate.postedAt)}
                    </p>
                  </Link>
                </Card>
              </li>
            );
          })
        ) : (
          <p className="text-center">No news updates have been found.</p>
        )}
      </ul>
      {showPaginationButtons && paginatedNewsUpdates.newsUpdates.length > 0 && (
        <NewsUpdatesPaginator
          currentPageIndex={pageIndex}
          hasPreviousPage={paginatedNewsUpdates.hasPreviousPage}
          hasNextPage={paginatedNewsUpdates.hasNextPage}
        />
      )}
    </>
  );
};

export default NewsUpdatesList;
