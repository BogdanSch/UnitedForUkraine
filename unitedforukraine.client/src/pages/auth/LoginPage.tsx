import { FC } from "react";
import { Image } from "../../components";

import loginImage from "/assets/img/loginImage.png";
import { SignInForm } from "../../containers/";

const LoginPage: FC = () => {
  return (
    <section className="auth login">
      <div className="container">
        <div className="login__wrap auth__wrap card p-3">
          <Image
            imageClassName="login-image"
            src={loginImage}
            alt={`Login page, featuring a cartoon character holding a tablet and sitting on a coach.`}
          />
          <div className="auth__hero-content">
            <div className="text-content">
              <h2 className="auth__title">Welcome back!</h2>
              <p className="auth__description">
                We have been missing you so much!
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
