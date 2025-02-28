import { FC } from "react";
import { Image } from "../../components";

import registerImage from "/assets/img/registerImage.png";
import { RegisterForm } from "../../containers/";

const RegisterPage: FC = () => {
  return (
    <section className="register auth">
      <div className="container">
        <div className="register__wrap auth__wrap card p-3">
          <div className="auth__hero-content">
            <div className="text-content">
              <h2 className="auth__title">Register</h2>
              <p className="auth__description">
                Are you new here? Let's exchange some information!
              </p>
            </div>
            <RegisterForm />
          </div>
          <Image
            className="register-image"
            src={registerImage}
            alt={`Register page, featuring a cartoon character holding a tablet and sitting on a coach.`}
          />
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
