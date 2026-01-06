import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { handleSelectWithDataTagChange } from "../../hooks/useCustomForm";
import { Card, MatchHighlight, Paginator, SearchBar } from "../../components";
import { PaginatedNewsUpdatesDto } from "../../types";
import { API_URL } from "../../variables";
import { convertToReadableDate } from "../../utils/helpers/dateHelper";
// import { convertToPreviewText } from "../../utils/helpers/stringHelper";

interface INewsUpdatesListProps {
  className?: string;
  showQueryCriteria: boolean;
  showPaginationButtons: boolean;
  campaignId?: number;
  [key: string]: any;
}

const getDefaultPaginatedNewsUpdates = (): PaginatedNewsUpdatesDto => ({
  newsUpdates: [],
  hasNextPage: false,
  hasPreviousPage: false,
});

const NewsUpdatesList: FC<INewsUpdatesListProps> = ({
  showQueryCriteria,
  showPaginationButtons,
  className = "",
  campaignId,
  ...rest
}) => {
  const [paginatedNewsUpdates, setPaginatedNewsUpdates] =
    useState<PaginatedNewsUpdatesDto>(getDefaultPaginatedNewsUpdates());
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
      if (campaignId) requestUrl += `&campaignIds=${campaignId}`;

      const { data } = await axios.get<PaginatedNewsUpdatesDto>(requestUrl);
      setPaginatedNewsUpdates(data);
    } catch (error) {
      console.log("Error fetching news updates: ", error);
      setPaginatedNewsUpdates(getDefaultPaginatedNewsUpdates());
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
        <form className="query" onSubmit={handleSearch}>
          <div className="query__container">
            <SearchBar searchInputReference={searchInputRef} />
            <div className="query__group">
              <div className="query__item">
                <label
                  className="form-label query__label"
                  htmlFor="sortOrderSelect"
                >
                  Select how to sort:
                </label>
                <select
                  className="form-select query__filter"
                  id="sortOrderSelect"
                  name="sortOrder"
                  onChange={(e) =>
                    handleSelectWithDataTagChange(e, setSortOrder)
                  }
                >
                  <option data-value="viewsCount_dsc">Most Popular</option>
                  <option data-value="date_dsc">Most Recent</option>
                  <option data-value="date_asc">Most Latest</option>
                  <option data-value="title_asc">Title</option>
                  <option data-value="readingTime_asc">Fastest to read</option>
                  <option data-value="readingTime_dsc">Longest to read</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      )}
      {paginatedNewsUpdates.newsUpdates.length > 0 ? (
        <ul
          className={`news__list mt-5 ${
            className.length > 0 ? " " + className : ""
          }`}
          {...rest}
        >
          {paginatedNewsUpdates.newsUpdates.map((newsUpdate) => {
            return (
              <li key={newsUpdate.id} className="news__item">
                <Card
                  imageSrc={newsUpdate.imageUrl}
                  imageAlt={newsUpdate.title}
                  cardStatus={newsUpdate.keyWords}
                  isLite={false}
                >
                  <Link
                    to={`/newsUpdates/detail/${newsUpdate.id}/`}
                    className="news__item-link"
                  >
                    <h3 className="card-title">
                      <MatchHighlight
                        text={newsUpdate.title}
                        query={searchQuery}
                      />
                    </h3>
                    <p className="card-text text-muted">
                      <MatchHighlight
                        text={newsUpdate.content}
                        query={searchQuery}
                      />
                    </p>
                    <p className="card-text text-muted">
                      <strong>Reading Time:</strong>{" "}
                      {newsUpdate.readingTimeInMinutes} minutes
                    </p>
                    <p className="card-text text-muted">
                      <strong>Posted At:</strong>{" "}
                      {convertToReadableDate(newsUpdate.postedAt)}
                    </p>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-center">No news updates have been found.</p>
      )}
      {showPaginationButtons && paginatedNewsUpdates.newsUpdates.length > 0 && (
        <Paginator
          linkPath={"/newsUpdates"}
          currentPageIndex={pageIndex}
          hasPreviousPage={paginatedNewsUpdates.hasPreviousPage}
          hasNextPage={paginatedNewsUpdates.hasNextPage}
        />
      )}
    </>
  );
};

export default NewsUpdatesList;
