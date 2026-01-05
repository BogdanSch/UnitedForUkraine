import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInForm } from "../../containers/";
import { Alert, Card, Image, Logo, ThemeSwitchButton } from "../../components";

import loginImage from "/assets/img/loginImage.png";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";

const LoginPage: FC = () => {
  const location = useLocation();
  const message: string = location.state?.message || "";

  return (
    <section className="auth login">
      <div className="container">
        <div className="login__wrap auth__wrap">
          <Card className="auth__interlink" isLite={false}>
            <Link className="auth__interlink-link" to="/">
              <Logo />
            </Link>
            <div className="theme">
              <ThemeSwitchButton />
            </div>
          </Card>
          <div className="auth__hero card p-3">
            <Image
              imageClassName="login-image"
              containerClassName="login-image__container"
              src={loginImage}
              alt={`Login page, featuring a cartoon character holding a tablet and sitting on a coach.`}
            />
            <div className="auth__hero-content">
              <div className="text-content">
                <h2 className="sub-heading auth__title">Welcome back, mate!</h2>
                {!isNullOrWhitespace(message) ? (
                  <Alert className="text-center mt-4" message={message} />
                ) : (
                  <p className="auth__description">
                    We have been missing you so much! Please fill in your
                    credentials to log in.
                  </p>
                )}
              </div>
              <SignInForm />
            </div>
          </div>
          <Card className="auth__interlink" isLite={false}>
            <i className="auth__interlink-icon bi bi-question-circle"></i>
            <div className="auth__interlink-text">
              Don't have an account?{" "}
              <Link to="/auth/register">Sign up here.</Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
