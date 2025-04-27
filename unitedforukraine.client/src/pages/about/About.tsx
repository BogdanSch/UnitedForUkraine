import { FC } from "react";

const About: FC = () => {
  return (
    <>
      <section className="history" id="history">
        <div className="container">
          <div className="history__wrap">
            <h1>Our Story</h1>
            <p>
              United For Ukraine started as a small project born out of
              compassion and a shared sense of responsibility among university
              students. What began as a classroom conversation quickly turned
              into a full-fledged platform connecting volunteers with real
              causes.
            </p>
            <p>
              We believe that small actions, when multiplied by a community, can
              create waves of change. Today, we are proud to say that our
              platform is helping unite compassionate individuals from all over
              the world to stand in solidarity with Ukraine.
            </p>
          </div>
        </div>
      </section>
      <section className="goals" id="goals">
        <div className="container">
          <div className="goals__wrap">
            <h2>Who We Help & How</h2>
            <p>
              United For Ukraine started as a small project born out of
              compassion and a shared sense of responsibility among university
              students. What began as a classroom conversation quickly turned
              into a full-fledged platform connecting volunteers with real
              causes.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
