import { FC } from "react";
import { Link } from "react-router-dom";

import { CampaignsList, FoundationStatisticsList } from "../../containers";
import {
  CallToActionSection,
  Card,
  Image,
  SectionHeadline,
} from "../../components";
import aboutImage from "/assets/img/aboutPreviewAbstract.webp";

const HomePage: FC = () => {
  return (
    <>
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero__wrap">
            <Card className="hero__card" isLite={true}>
              <h1 className="heading hero__title">
                United for Ukraine:{" "}
                <span className="yellow">Stand with Us</span>
              </h1>
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
              <SectionHeadline
                className={`about__headline`}
                title={`About Us`}
                sectionIndicatorTitle={`Helping Ukrainian nation`}
              />
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
              imageClassName="about__image"
              src={aboutImage}
              alt="Abstract decoration element for about section"
            />
          </div>
        </div>
      </section>
      <section className="campaigns" id="campaigns">
        <div className="container">
          <div className="campaigns__wrap">
            <SectionHeadline
              className={`campaigns__headline`}
              title={`Support Our Current Campaigns`}
              sectionIndicatorTitle={`Campaigns`}
            >
              <Link className="btn btn-outline-dark" to="/campaigns">
                View All Campaigns
              </Link>
            </SectionHeadline>
            <CampaignsList
              showPaginationButtons={false}
              showQueryCriteria={false}
              showUserCampaigns={false}
            />
          </div>
        </div>
      </section>
      <section className="features" id="features">
        <div className="container">
          <div className="features__wrap">
            <SectionHeadline
              className={`features__headline`}
              title={`Our values`}
              sectionIndicatorTitle={`Features`}
            />
            <ul className="features__list mt-5">
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Transparency
                    </h3>
                    <p className="features__item-description">
                      We are committed to maintaining transparency in all our
                      operations and financial transactions.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-hourglass"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Integrity
                    </h3>
                    <p className="features__item-description">
                      We uphold the highest ethical standards in everything we
                      do, ensuring honesty and fairness in our actions.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-shield-lock"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Collaboration
                    </h3>
                    <p className="features__item-description">
                      We believe in the power of teamwork and actively foster an
                      inclusive and supportive environment.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-people"></i>
                </Card>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="statistics" id="statistics">
        <div className="container">
          <div className="statistics__wrap">
            <SectionHeadline
              className={`statistics__headline`}
              sectionIndicatorTitle={`Donations Statistics`}
              title={`For the past 30 days`}
              description={`A transparent overview of donation activity over the past 30 days, showcasing contributions and their impact.`}
            >
              <Link
                className="btn btn-outline-secondary"
                to={{
                  pathname: "/dashboard",
                  hash: "#dashboardStatistics",
                }}
              >
                View Your Statistics
              </Link>
            </SectionHeadline>
            <FoundationStatisticsList />
          </div>
        </div>
      </section>
      <CallToActionSection />
    </>
  );
};

export default HomePage;
