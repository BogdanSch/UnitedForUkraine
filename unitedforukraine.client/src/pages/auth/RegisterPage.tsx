import { FC } from "react";
import { Card, Image, Logo } from "../../components";

import registerImage from "/assets/img/registerImage.jpg";
import { RegisterForm } from "../../containers/";
import { Link } from "react-router-dom";
import { ThemeSwitchButton } from "../../components";

const RegisterPage: FC = () => {
  return (
    <section className="register auth">
      <div className="container">
        <div className="register__wrap auth__wrap">
          <Card className="auth__interlink" isLite={false}>
            <Link className="auth__interlink-link" to="/">
              <Logo />
            </Link>
            <div className="theme">
              <ThemeSwitchButton />
            </div>
          </Card>
          <div className="auth__hero card p-3">
            <div className="auth__hero-content">
              <div className="text-content">
                <h2 className="sub-heading auth__title">Register</h2>
                <p className="auth__description">
                  Are you new here? Let's create a new account for you!
                </p>
              </div>
              <RegisterForm />
            </div>
            <Image
              imageClassName="register-image"
              containerClassName="register-image__container"
              src={registerImage}
              alt={`Register page, featuring a cartoon character holding a tablet and sitting on a coach.`}
            />
          </div>
          <Card className="auth__interlink" isLite={false}>
            <i className="auth__interlink-icon bi bi-question-circle"></i>
            <div className="auth__interlink-text">
              Already have an account?{" "}
              <Link to="/auth/login">Sign in here.</Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
