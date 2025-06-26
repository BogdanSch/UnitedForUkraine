import { FC } from "react";
import {
  CallToActionSection,
  Card,
  SectionHeadline,
  Carousel,
  Gallery,
} from "../../components";
import { ImageDto } from "../../types";

import mission1 from "/assets/img/carousel/glib-albovsky.jpg";
import mission2 from "/assets/img/carousel/taras-chuiko.jpg";
import mission3 from "/assets/img/carousel/unicef-ioana-moldovan.jpg";
import mission4 from "/assets/img/carousel/ukraine-help-map.jpg";

import impact1 from "/assets/img/impact/giving-out-food.jpg";
import impact2 from "/assets/img/impact/volunteers-packing-stuff.jpg";
import impact3 from "/assets/img/impact/ukrainian-protests.jpg";
import impact4 from "/assets/img/impact/volunteers-helping-grandma.jpg";

const About: FC = () => {
  const carouselImages: ImageDto[] = [
    {
      path: mission1,
      alt: "Volunteer Glib Albovsky aiding local efforts",
      title: "Glib Albovsky in Action",
      description:
        "Volunteer Glib Albovsky providing essential support on the ground as part of our mission to assist Ukrainian communities in need.",
    },
    {
      path: mission2,
      alt: "Taras Chuiko offering humanitarian aid",
      title: "Taras Chuiko’s Humanitarian Effort",
      description:
        "Taras Chuyko provides help in evacuating families in the vicinity of the fighting.",
    },
    {
      path: mission3,
      alt: "UNICEF efforts in Ukraine by Ioana Moldovan",
      title: "UNICEF Ukraine Outreach",
      description:
        "Photo by Ioana Moldovan showcasing UNICEF's fieldwork in Ukraine—supporting children and families with education, supplies, and care.",
    },
    {
      path: mission4,
      alt: "Interactive map showing humanitarian aid locations across Ukraine",
      title: "Ukraine Aid Distribution Map",
      description:
        "An interactive map highlighting areas in Ukraine receiving support, guiding our mission planning and showing real-time impact.",
    },
  ];
  const impactImages: ImageDto[] = [
    {
      path: impact1,
      alt: "Volunteers handing out food supplies",
      title: "Food Distribution Drive",
      description:
        "Volunteers distribute essential food supplies to civilians in need, ensuring no one is left behind during crises.",
    },
    {
      path: impact2,
      alt: "Volunteers packing aid packages",
      title: "Packing Relief Supplies",
      description:
        "Behind the scenes: our dedicated team packs food, hygiene kits, and essentials for rapid deployment to conflict zones.",
    },
    {
      path: impact3,
      alt: "Ukrainians protesting in support of national sovereignty",
      title: "Ukrainian Protests",
      description:
        "Civilians gather in peaceful protest, demonstrating resilience, unity, and support for Ukraine’s sovereignty and freedom.",
    },
    {
      path: impact4,
      alt: "Volunteers helping an elderly woman",
      title: "Helping the Elderly",
      description:
        "A touching moment where volunteers assist an elderly woman, embodying our mission of compassion and community care.",
    },
  ];

  return (
    <>
      <section className="history" id="history">
        <div className="container">
          <div className="history__wrap">
            <h1 className="heading">Our Story</h1>
            <p className="history__description">
              <strong>United For Ukraine</strong> started as a small project
              born out of compassion and a shared sense of responsibility among
              university students. What began as a classroom conversation
              quickly turned into a full-fledged platform connecting volunteers
              with real causes.
            </p>
            <p className="history__description">
              We believe that small actions, when multiplied by a community, can
              create waves of change. Today, we are proud to say that our
              platform is helping unite compassionate individuals from all over
              the world to stand in solidarity with Ukraine.
            </p>
            <a className="btn btn-secondary btn-lg" href="#mission">
              Read more
            </a>
          </div>
        </div>
      </section>
      <section className="mission" id="mission">
        <div className="container">
          <div className="mission__wrap">
            <SectionHeadline
              className={`mission__headline`}
              title={`Who We Help & How?`}
              sectionIndicatorTitle={`Mission`}
              description={`United For Ukraine
                  started as a small project born out of compassion and a shared
                  sense of responsibility among university students. What began
                  as a classroom conversation quickly turned into a full-fledged
                  platform connecting volunteers with real causes.`}
            />
            <Carousel
              id="missionCarousel"
              className="mission__carousel"
              images={carouselImages}
            />
            <div className="mt-3 text-end">
              <a className="btn btn-secondary btn-lg" href="#features">
                Read more
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="features" id="features">
        <div className="container">
          <div className="features__wrap">
            <SectionHeadline
              className={`features__headline`}
              title={`Key Features and Values`}
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
                      We ensure honesty and fairness in our actions.
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
                      We believe in the power of teamwork and support everyone.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-people"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Commitment to Impact
                    </h3>
                    <p className="features__item-description">
                      Our goal is not just to provide immediate aid, but to
                      create lasting change for Ukrainians, soldiers, and
                      refugees.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-hand-thumbs-up"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Dedication to Humanity
                    </h3>
                    <p className="features__item-description">
                      Every effort we make is driven by the belief that every
                      individual deserves dignity and respect.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-heart"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Efficiency and Action
                    </h3>
                    <p className="features__item-description">
                      We prioritize swift and efficient action in distributing
                      aid, ensuring that resources reach their destination
                      without delay.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-clock"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Local Partnerships
                    </h3>
                    <p className="features__item-description">
                      We work closely with local organizations to ensure that
                      aid is effective and sustainable.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-boxes"></i>
                </Card>
              </li>
              <li className="features__item">
                <Card className="card-border p-3" isLite={false}>
                  <div className="features__item-body">
                    <h3 className="sub-heading features__item-title">
                      Mission-Driven Leadership
                    </h3>
                    <p className="features__item-description">
                      Our leaders are committed to the mission, guiding us
                      toward achieving our goals and sustaining our impact.
                    </p>
                  </div>
                  <i className="features__item-svg bi bi-person-lines-fill"></i>
                </Card>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="impact" id="impact">
        <div className="container">
          <div className="impact__wrap">
            <SectionHeadline
              className={`impact__headline`}
              title={`Real Change`}
              sectionIndicatorTitle={`Our Impact`}
              description={`Since our foundation, we’ve been working tirelessly to provide
                humanitarian aid, shelter, and support to Ukrainian refugees and
                soldiers. Here's how we've made a lasting difference.`}
            />
            <div className="impact__content">
              <div className="impact-accordion accordion" id="impactAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                    >
                      Refugee Assistance
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="accordion-collapse collapse show"
                  >
                    <div className="accordion-body">
                      <h4 className="sub-heading">10,000+</h4>
                      <p>Refugees helped with supplies and housing</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTwo"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseTwo"
                    >
                      Family Support
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseTwo"
                    className="accordion-collapse collapse"
                  >
                    <div className="accordion-body">
                      <h4 className="sub-heading">500+</h4>
                      <p>
                        Families supported with financial aid and care packages
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseThree"
                      aria-expanded="false"
                      aria-controls="panelsStayOpen-collapseThree"
                    >
                      Support for Soldiers
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseThree"
                    className="accordion-collapse collapse"
                  >
                    <div className="accordion-body">
                      <h4 className="sub-heading">1,000+</h4>
                      <p>
                        Soldiers equipped with essentials and mental health
                        resources
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="impact-stories mt-5">
                <h3 className="impact-stories__title sub-heading">
                  Real Stories
                </h3>
                <ul className="impact-stories__list">
                  <li className="impact-stories__item">
                    <Card
                      className="impact-stories__testimonial"
                      cardStatus="Svitlana, Refugee"
                      isLite={true}
                    >
                      <div className="text-content">
                        <em>
                          &quot;Thanks to this incredible organization, my
                          children and I are safe. I never imagined we could
                          find such support after fleeing our home.&quot;
                        </em>
                      </div>
                    </Card>
                  </li>
                  <li className="impact-stories__item">
                    <Card
                      className="impact-stories__testimonial"
                      cardStatus="Andriy, Volunteer"
                      isLite={true}
                    >
                      <div className="text-content">
                        <em>
                          &quot;I joined as a volunteer to help others, but I
                          never expected how much it would change me. Seeing the
                          hope in people's eyes after receiving aid is something
                          I'll never forget.&quot;
                        </em>
                      </div>
                    </Card>
                  </li>
                  <li className="impact-stories__item">
                    <Card
                      className="impact-stories__testimonial"
                      cardStatus="Olena, Donor"
                      isLite={true}
                    >
                      <div className="text-content">
                        <em>
                          &quot;Giving to this cause was the best decision I've
                          made. Knowing that my contribution helped families
                          survive and rebuild their lives gives me real peace of
                          mind.&quot;
                        </em>
                      </div>
                    </Card>
                  </li>
                </ul>
              </div>
              <div className="impact-visuals mt-5">
                <h3 className="impact-stories__title sub-heading">
                  Our Work in Action
                </h3>
                <Gallery
                  images={impactImages}
                  id={"impactGallery"}
                  className="impact-gallery"
                />
              </div>
              <div className="impact-future mt-5">
                <Card className="impact-future__card" isLite={true}>
                  <h3 className="impact-stories__title sub-heading">
                    Our Goals for the Future
                  </h3>
                  <p>
                    We are determined to expand our efforts in 2025, with plans
                    to build new community centers and offer vocational training
                    for refugees. Join us in making this vision a reality.
                  </p>
                  <div className="impact__cta">
                    <a className="btn btn-lg btn-secondary" href="#donate">
                      Get Involved
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CallToActionSection />
    </>
  );
};

export default About;
