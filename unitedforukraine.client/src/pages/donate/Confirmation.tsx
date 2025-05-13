import { FC } from "react";

const Confirmation: FC = () => {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__wrap">
          <h2 className="donate__title">Thank you for your donation!</h2>
          <p className="donate__description">
            Your support makes a great difference.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;
