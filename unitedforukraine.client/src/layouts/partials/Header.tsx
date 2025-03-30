import { FC, useContext, useEffect } from "react";
import { ScrollSpy } from "bootstrap";
import { Link, useLocation } from "react-router-dom";

import { Logo } from "../../components";
import { SignOutForm } from "../../containers";
import AuthContext from "../../contexts/AuthContext";

const Header: FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    new ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });

    return () => {
      ScrollSpy.getInstance(document.body)?.dispose();
    };
  }, []);

  useEffect(() => {
    const currentPathName: string = location.pathname;

    console.log(currentPathName);

    const navLinks: HTMLLIElement[] = Array.from(
      document.querySelectorAll<HTMLLIElement>(".nav-link")
    );
    navLinks.forEach((navLink) => {
      const navLinkPathName: string = navLink.getAttribute("href")!;

      if (
        navLinkPathName === currentPathName ||
        currentPathName.includes(navLinkPathName) ||
        (navLinkPathName === "/home" && currentPathName === "/")
      ) {
        navLink.classList.add("active");
      } else {
        navLink.classList.remove("active");
      }
    });
  }, [location]);

  return (
    <header
      className="header navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
      id="mainNav"
    >
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <Logo />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#responsiveNavbar"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi-list"></i>
        </button>
        <nav
          className="header__navbart collapse navbar-collapse"
          id="responsiveNavbar"
        >
          <ul className="header__list navbar-nav ms-auto me-4 my-3 my-lg-0">
            <li className="nav-item">
              <Link className="nav-link me-lg-3" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link me-lg-3" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link me-lg-3" to="/campaigns">
                Campaigns
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link me-lg-3" to="/blog">
                Blog
              </Link>
            </li>
          </ul>
          <Link
            className="btn btn-primary rounded-pill px-3 mb-2 mb-lg-0"
            to={`/campaigns`}
          >
            <span className="d-flex align-items-center">
              <i className="bi bi-balloon-heart-fill me-2"></i>
              <span className="small">Donate Now</span>
            </span>
          </Link>
          {isAuthenticated() ? (
            <div className="header__profile dropdown">
              <button
                type="button"
                className="btn btn-profile d-block link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg className="header__profile-svg" width="32" height="32">
                  <use xlinkHref="#userProfile"></use>
                </svg>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to={`/dashboard`}>
                    My profile
                  </Link>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <SignOutForm />
                </li>
              </ul>
            </div>
          ) : (
            <div className="header__auth-buttons card p-2">
              <Link className="btn btn-outline-secondary" to={`/auth/login`}>
                Log in
              </Link>
              <Link className="btn btn-sky" to={`/auth/register`}>
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
