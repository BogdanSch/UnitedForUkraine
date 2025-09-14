import { FC } from "react";
import { Link } from "react-router-dom";

type INewsUpdatesPaginatorProps = {
  currentPageIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const NewsUpdatesPaginator: FC<INewsUpdatesPaginatorProps> = ({
  currentPageIndex,
  hasNextPage,
  hasPreviousPage,
}) => {
  return (
    <nav className="news__paginator-nav" aria-label="Page navigation example">
      <ul className="news__paginator pagination">
        <li className="page-item">
          <Link
            className={`page-link${hasPreviousPage ? "" : " disabled"}`}
            to={{
              pathname: "/newsUpdates",
              search: `?page=${currentPageIndex - 1}`,
            }}
          >
            Previous
          </Link>
        </li>
        <li className="page-item">
          <Link
            className={`page-link ${hasNextPage ? "" : "disabled"}`}
            to={{
              pathname: "/newsUpdates",
              search: `?page=${currentPageIndex + 1}`,
            }}
          >
            Next
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NewsUpdatesPaginator;
