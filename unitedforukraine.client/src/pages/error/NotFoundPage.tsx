import { FC } from "react";
import { Link } from "react-router-dom";

const NotFound: FC = () => (
  <section className="error">
    <div className="container">
      <div className="error__wrap text-center">
        <div className="card">
          <div className="card-body">
            <h2 className="error__tite">404 Error: Page not found</h2>
            <p className="error__description">
              The page you tried to access doesn't exist.
            </p>
            <Link to="/home" className="btn btn-dark">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NotFound;
