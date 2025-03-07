import { FC } from "react";
import { Link } from "react-router-dom";

import { CampaignsList } from "../../containers";
import { Card, Image } from "../../components";
import aboutImage from "/assets/img/aboutPreviewAbstract.webp";

import formatMoney from "../../utils/formatMoney";
import formatNumber from "../../utils/formatNumber";

const HomePage: FC = () => {
  return (
    <>
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero__wrap">
            <Card className="hero__card" imageSrc="" imageAlt="">
              <h1 className="hero__title">United for Ukraine: Stand with Us</h1>
              <p className="hero__description">
                Providing essential aid, shelter, and opportunities for
                Ukrainian refugees as they rebuild their lives with dignity,
                hope, and resilience. Join us in making a difference today.
              </p>
              <Link className="btn btn-outline-primary" to={`/campaigns`}>
                <i className="bi bi-balloon-heart-fill me-2"></i>
                <span className="small ms-2">Donate Now</span>
              </Link>
            </Card>
          </div>
        </div>
      </section>
      <section className="about" id="about">
        <div className="container">
          <div className="about__wrap">
            <div className="text-content">
              <h4 className="section-indicator">About Us</h4>
              <h2 className="about__title">Helping Ukrainian nation</h2>
              <p className="about__description">
                Our mission is to provide essential support to the Ukrainian
                people during these challenging times. We work tirelessly to
                offer humanitarian aid, shelter, and opportunities for displaced
                individuals and families, helping them regain stability and
                rebuild their lives. Through collective efforts, we strive to
                restore hope, dignity, and resilience in communities affected by
                war. Join us in making a difference—because together, we are
                stronger.
              </p>
              <Link className="btn btn-primary" to="/about">
                Read more.
              </Link>
            </div>
            <Image
              className="about__image"
              src={aboutImage}
              alt="Abstract decoration element for about section"
            />
          </div>
        </div>
      </section>
      <section className="campaigns" id="campaigns">
        <div className="container">
          <div className="campaigns__wrap">
            <div className="campaigns__headline">
              <div className="text-group">
                <h4 className="section-indicator">Campaigns</h4>
                <h2 className="campaigns__title">
                  Support Our Current Campaigns
                </h2>
              </div>
              <Link className="btn btn-outline-dark" to="/campaigns">
                View All Campaigns
              </Link>
            </div>
            <CampaignsList />
          </div>
        </div>
      </section>
      <section className="features" id="features">
        <div className="container">
          <div className="features__wrap">
            <div className="text-group text-end">
              <h4 className="section-indicator">Features</h4>
              <h2 className="features__title">Our values</h2>
            </div>
            <ul className="features__list mt-5">
              <li className="features__item card card-border p-4">
                <div className="features__item-body">
                  <h3 className="features__item-title">Transparency</h3>
                  <p className="features__item-description">
                    We are committed to maintaining transparency in all our
                    operations and financial transactions.
                  </p>
                </div>
                <i className="features__item-svg bi bi-hourglass"></i>
              </li>
              <li className="features__item card card-border p-4">
                <div className="features__item-body">
                  <h3 className="features__item-title">Integrity</h3>
                  <p className="features__item-description">
                    We uphold the highest ethical standards in everything we do,
                    ensuring honesty and fairness in our actions.
                  </p>
                </div>
                <i className="features__item-svg bi bi-shield-lock"></i>
              </li>
              <li className="features__item card card-border p-4">
                <div className="features__item-body">
                  <h3 className="features__item-title">Collaboration</h3>
                  <p className="features__item-description">
                    We believe in the power of teamwork and actively foster an
                    inclusive and supportive environment.
                  </p>
                </div>
                <i className="features__item-svg bi bi-people"></i>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* Hard coded */}
      <section className="statistics" id="statistics">
        <div className="container">
          <div className="statistics__wrap">
            <div className="statistics__headline">
              <div className="text-group">
                <h4 className="section-indicator">Donations Statistics</h4>
                <h2 className="statistics__title">For the past 30 days</h2>
                <p className="statistics__description">
                  A transparent overview of donation activity over the past 30
                  days, showcasing contributions and their impact.
                </p>
              </div>
              <Link
                className="btn btn-outline-secondary"
                to="/dashboard#donations"
              >
                View Your Statistics
              </Link>
            </div>
            <ul className="statistics__list mt-4">
              <li className="statistics__item card card-border p-3">
                <div className="statistics__item-group">
                  <i className="bi bi-currency-exchange"></i>
                  <h4 className="statistics__item-title">
                    Total Donations Received
                  </h4>
                </div>
                <p className="statistics__item-amount">
                  {formatMoney(1200000)} <span className="currency">UAH</span>
                </p>
              </li>
              <li className="statistics__item card card-border p-3">
                <div className="statistics__item-group">
                  <i className="bi bi-card-checklist"></i>
                  <h4 className="statistics__item-title">
                    Total Donations Number
                  </h4>
                </div>
                <p className="statistics__item-amount">
                  {formatNumber(50000)}+
                </p>
              </li>
              <li className="statistics__item card card-border p-3">
                <div className="statistics__item-group">
                  <i className="bi bi-arrow-left-right"></i>
                  <h4 className="statistics__item-title">Average Donation</h4>
                </div>
                <p className="statistics__item-amount">
                  {formatMoney(1200)} <span className="currency">UAH</span>
                </p>
              </li>
              <li className="statistics__item card card-border p-3">
                <div className="statistics__item-group">
                  <i className="bi bi-people"></i>
                  <h4 className="statistics__item-title">Unique Donors</h4>
                </div>
                <p className="statistics__item-amount">
                  {formatNumber(35000)}+
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="donate" id="donate">
        <div className="container">
          <div className="donate__wrap">
            <div className="text-content">
              <h2 className="donate__title">Make a Difference Today</h2>
              <p className="donate__description">
                Your contribution can help provide essential aid, shelter, and
                opportunities for Ukrainian refugees as they rebuild their lives
                with dignity, hope, and resilience. Donate now to make a
                difference.
              </p>
              <Link className="btn btn-primary" to="/campaigns">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
