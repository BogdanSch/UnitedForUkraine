import { FC } from "react";

const Failed: FC = () => {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__wrap">
          <h2 className="donate__title">
            Weird, something has happened during check-out!
          </h2>
          <p className="donate__description">
            Your donation request has failed! Try again later or contact us
            directly. We are here to help you!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Failed;
