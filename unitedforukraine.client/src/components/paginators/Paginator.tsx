import { FC } from "react";
import { Link } from "react-router-dom";

type PaginatorProps = {
  linkPath: string;
  currentPageIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const Paginator: FC<PaginatorProps> = ({
  linkPath,
  currentPageIndex,
  hasNextPage,
  hasPreviousPage,
}) => {
  return (
    <nav className="paginator-nav" aria-label="List navigation">
      <ul className="paginator pagination">
        <li className="page-item">
          <Link
            className={`page-link ${hasPreviousPage ? "" : "disabled"}`}
            to={{
              pathname: linkPath,
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
              pathname: linkPath,
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

export default Paginator;
