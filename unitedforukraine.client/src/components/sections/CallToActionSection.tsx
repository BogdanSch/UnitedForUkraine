import { FC } from "react";
import { Link } from "react-router-dom";

const CallToActionSection: FC = () => {
  return (
    <section className="donate" id="donate">
      <div className="container">
        <div className="donate__wrap">
          <div className="text-content">
            <h2 className="heading heading--light">Make a Difference Today</h2>
            <p className="donate__description mb-2">
              Your contribution can help provide essential aid, shelter, and
              opportunities for Ukrainian refugees as they rebuild their lives
              with dignity, hope, and resilience. Donate now to make a
              difference.
            </p>
            <Link className="btn btn-lg btn-primary" to="/campaigns">
              <div className="d-flex flex-row align-items-center gap-2">
                <span>Donate Now</span>
                <i className="bi bi-cash-coin"></i>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
