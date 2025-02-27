import { FC } from "react";
import { Image } from "../../components";

import loginImage from "/assets/img/loginImage.png";
import SignInForm from "../../containers/SignInForm";

const LoginPage: FC = () => {
  return (
    <section className="login">
      <div className="container">
        <div className="login__wrap card p-3">
          <Image
            className="login-image"
            src={loginImage}
            alt={`Login page, featuring a cartoon character holding a tablet and sitting on a coach.`}
          />
          <div className="login__hero-content">
            <div className="text-content">
              <h2 className="login__title">Welcome back!</h2>
              <p className="login__description">
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
