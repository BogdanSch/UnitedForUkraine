import { FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => (
  <section className="error">
    <div className="container">
      <div className="error__wrap">
        <div className="card error__card text-center">
          <div className="card-body">
            <h2 className="error__title">Whoops!</h2>
            <h3 className="error__sub-title mt-3">404 - Page not found</h3>
            <p className="error__description">
              The page you are looking for might have been removed, had its name
              changed or is temporarily unavailable.
            </p>
            <div className="mt-4">
              <Link to="/home" className="btn btn-secondary">
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NotFound;
