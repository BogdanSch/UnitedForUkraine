import { FC, RefObject } from "react";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";

interface ISearchBarProps {
  searchInputReference: RefObject<HTMLInputElement>;
  className?: string;
  searchPlaceholder?: string;
}

const SearchBar: FC<ISearchBarProps> = ({
  searchInputReference,
  className,
  searchPlaceholder,
}) => {
  const DEFAULT_PLACEHOLDER: string =
    "What are we searching for: support, reports, or help?";
  return (
    <div
      className={`input-group${
        !isNullOrWhitespace(className) ? ` ${className}` : ""
      } query__search`}
    >
      <div className="form-outline">
        <input
          type="search"
          id="searchInput"
          className={`form-control query__search-input`}
          ref={searchInputReference}
          placeholder={searchPlaceholder || DEFAULT_PLACEHOLDER}
        />
      </div>
      <button type="submit" className="btn btn-primary input-group-button">
        <i className="bi bi-search-heart"></i>
      </button>
    </div>
  );
};

export default SearchBar;
