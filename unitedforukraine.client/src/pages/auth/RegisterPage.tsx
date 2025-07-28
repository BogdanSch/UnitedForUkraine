import { FC } from "react";
import { Card, Image } from "../../components";

import registerImage from "/assets/img/registerImage.jpg";
import { RegisterForm } from "../../containers/";
import { Link } from "react-router-dom";

const RegisterPage: FC = () => {
  return (
    <section className="register auth">
      <div className="container">
        <div className="register__wrap auth__wrap">
          <div className="auth__hero card p-3">
            <div className="auth__hero-content">
              <div className="text-content">
                <h2 className="auth__title">Register</h2>
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
            Already have an account? <Link to="/auth/login">Sign in here.</Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
