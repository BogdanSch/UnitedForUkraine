import { FC } from "react";

const HomePage: FC = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__wrap">
          <div className="text-content">
            <h1 className="hero__title">United for Ukraine: Stand with Us</h1>
            <p className="hero__description">
              Providing essential aid, shelter, and opportunities for Ukrainian
              refugees as they rebuild their lives with dignity, hope, and
              resilience. Join us in making a difference today.
            </p>
            <button className="btn btn-outline-primary">Donate Now</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
