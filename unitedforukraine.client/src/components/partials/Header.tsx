import { FC, useEffect, useRef } from "react";
// import bootstrap from "bootstrap";
import { ScrollSpy } from "bootstrap";
import Logo from "../logo/Logo";

const Header: FC = () => {
  const headerRef = useRef<HTMLDivElement>(null)!;
  const navbarTogglerRef = useRef<HTMLButtonElement>(null)!;
  const navbarListRef = useRef<HTMLUListElement>(null)!;

  useEffect(() => {
    if (
      !headerRef.current ||
      !navbarTogglerRef.current ||
      !navbarListRef.current
    ) {
      return;
    }

    const scrollSpy = new ScrollSpy(document.body, {
      target: "#mainNav",
      offset: 74,
    });

    const navbarToggler = navbarTogglerRef.current;
    const navbarList = navbarListRef.current;
    const responsiveNavItems = Array.from(
      navbarList.querySelectorAll(".nav-link")
    );

    const handleNavItemClick = () => {
      if (window.getComputedStyle(navbarToggler!).display !== "none") {
        navbarToggler!.click();
      }
    };

    responsiveNavItems.forEach((item) => {
      item.addEventListener("click", handleNavItemClick);
    });

    return () => {
      responsiveNavItems.forEach((item) => {
        item.removeEventListener("click", handleNavItemClick);
      });
      scrollSpy.dispose();
    };
  }, [headerRef, navbarTogglerRef, navbarListRef]);

  return (
    <header
      className="header navbar navbar-expand-lg navbar-light fixed-top shadow-sm"
      id="mainNav"
      ref={headerRef}
    >
      <div className="container">
        <a className="navbar-brand fw-bold" href="#page-top">
          <Logo />
        </a>
        <button
          ref={navbarTogglerRef}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menu
          <i className="bi-list"></i>
        </button>
        <nav className="collapse navbar-collapse" id="navbarResponsive">
          <ul
            className="navbar-nav ms-auto me-4 my-3 my-lg-0"
            ref={navbarListRef}
          >
            <li className="nav-item">
              <a className="nav-link me-lg-3" href="#features">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link me-lg-3" href="#download">
                Download
              </a>
            </li>
          </ul>
          <button
            className="btn btn-primary rounded-pill px-3 mb-2 mb-lg-0"
            data-bs-toggle="modal"
            data-bs-target="#feedbackModal"
          >
            <span className="d-flex align-items-center">
              <i className="bi-chat-text-fill me-2"></i>
              <span className="small">Send Feedback</span>
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
