import { FC } from "react";
import { Link } from "react-router-dom";

const NotAuthorized: FC = () => (
  <section className="error">
    <div className="container">
      <div className="error__wrap">
        <div className="card error__card text-center">
          <div className="card-body">
            <h2 className="error__title">Whoops!</h2>
            <h3 className="error__sub-title mt-3">
              401 - You are not authorized
            </h3>
            <p className="error__description">
              It looks like you tried to access a page that requires special
              permissions. This could mean you're not logged in, or your account
              doesn't have the necessary privileges to view this content.
            </p>
            <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/auth/login" className="btn btn-primary">
                Login
              </Link>
              <Link to="/home" className="btn btn-secondary">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default NotAuthorized;
