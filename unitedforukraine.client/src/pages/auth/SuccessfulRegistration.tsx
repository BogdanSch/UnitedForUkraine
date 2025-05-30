import { FC } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components";

const SuccessfulRegistration: FC = () => {
  return (
    <section className="successful-registration">
      <div className="container">
        <Card isLite={true} className="successful-registration__wrap p-4">
          <svg className="successful-registration__icon">
            <use xlinkHref="#successIcon"></use>
          </svg>
          <div className="successful-registration__body">
            <h2 className="successful-registration__title">
              Registration Successful
            </h2>
            <p className="successful-registration__message">
              Thank you for registering! Your account has been successfully
              created. You can now log in to your account!
            </p>
            <Link className="btn btn-outline-sky" to={`/auth/login`}>
              Go to Login Page
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SuccessfulRegistration;
