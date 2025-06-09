import { FC } from "react";
import { Link } from "react-router-dom";

type CampaignsPaginatorProps = {
  currentPageIndex: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const CampaignsPaginator: FC<CampaignsPaginatorProps> = ({
  currentPageIndex,
  hasNextPage,
  hasPreviousPage,
}) => {
  return (
    <nav
      className="campaigns__paginator-nav"
      aria-label="Page navigation example"
    >
      <ul className="campaigns__paginator pagination">
        <li className="page-item">
          <Link
            className={`page-link ${hasPreviousPage ? "" : "disabled"}`}
            to={{
              pathname: "/campaigns",
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
              pathname: "/campaigns",
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

export default CampaignsPaginator;
