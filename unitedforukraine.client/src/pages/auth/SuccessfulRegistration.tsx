import { FC } from "react";
import { Link } from "react-router-dom";

const SuccessfulRegistration: FC = () => {
  return (
    <section className="successful-registration">
      <div className="container">
        <div className="successful-registration__wrap">
          <h2 className="successful-registration__title">
            Registration Successful
          </h2>
        </div>
        <div className="successful-registration__body">
          <p className="successful-registration__message">
            Thank you for registrating! Your account has been successfully
            created. You can now log in to your account.
          </p>
          <Link className="btn btn-primary" to={`/auth/login`}>
            Go to Login Page
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessfulRegistration;
