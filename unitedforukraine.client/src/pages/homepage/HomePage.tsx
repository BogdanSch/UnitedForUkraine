import { FC } from "react";
import { Link } from "react-router-dom";

import { CampaignsList } from "../../containers";
import { Card, Image } from "../../components";
import aboutImage from "/assets/img/aboutPreviewAbstract.webp";

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
              <h2 className="about__title">Helping Ukrainian nation.</h2>
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
              <div className="campaigns-text-group">
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
    </>
  );
};

export default HomePage;
