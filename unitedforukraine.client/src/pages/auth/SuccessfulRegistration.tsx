import { FC } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components";

const SuccessfulRegistration: FC = () => {
  return (
    <section className="registration registration--success">
      <div className="container">
        <Card isLite={true} className="registration__wrap p-4">
          <svg className="registration__icon">
            <use xlinkHref="#successIcon"></use>
          </svg>
          <div className="registration__body">
            <h2 className="registration__title">Registration Successful</h2>
            <p className="registration__message">
              Thank you for registering! We need to verify your email address
              before you can log in.
            </p>
            <p className="registration__message">
              We've sent a verification email to the address you provided during
              registration.
            </p>
            <Link className="btn btn-outline-sky" to={`/auth/login`}>
              Go to the Login Page
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default SuccessfulRegistration;
