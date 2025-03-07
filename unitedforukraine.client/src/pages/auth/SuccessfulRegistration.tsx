import { FC } from "react";
import { Link } from "react-router-dom";

const SuccessfulRegistration: FC = () => {
  return (
    <section className="successful-registration">
      <div className="container">
        <div className="successful-registration__wrap card p-4">
          <svg className="successful-registration__icon">
            <use xlinkHref="#successIcon"></use>
          </svg>
          <div className="successful-registration__body">
            <h2 className="successful-registration__title">
              Registration Successful
            </h2>
            <p className="successful-registration__message">
              Thank you for registrating! Your account has been successfully
              created. You can now log in to your account.
            </p>
            <Link className="btn btn-outline-sky" to={`/auth/login`}>
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessfulRegistration;
