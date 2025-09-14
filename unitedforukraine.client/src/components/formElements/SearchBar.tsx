import { FC, RefObject } from "react";

interface ISearchBarProps {
  searchInputReference: RefObject<HTMLInputElement>;
  className: string;
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
    <div className={`input-group ${className}__query-search`}>
      <div className="form-outline">
        <input
          type="search"
          id="searchInput"
          className={`form-control ${className}__query-search-input`}
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
