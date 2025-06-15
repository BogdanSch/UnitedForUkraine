import { FC } from "react";

const Confirmation: FC = () => {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__wrap text-center">
          <h2 className="heading heading--light">
            Thank you for your donation!
          </h2>
          <p className="donate__description">
            Your support makes a great difference.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;
