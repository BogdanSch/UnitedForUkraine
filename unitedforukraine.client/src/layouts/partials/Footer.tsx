import { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="footer text-center py-5">
      <div className="container">
        <div className="footer__wrap">
          <div className="footer__copyright">
            &copy; United For Ukraine 2025. All Rights Reserved.
          </div>
          <nav className="navbar footer__list">
            <a className="footer__item" href="#!">
              Privacy
            </a>
            <a className="footer__item" href="#!">
              Terms
            </a>
            <a className="footer__item" href="#!">
              FAQ
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
