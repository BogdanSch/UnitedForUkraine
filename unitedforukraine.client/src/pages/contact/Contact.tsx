import { FC } from "react";
import { ContactForm } from "../../containers";
import { Link } from "react-router-dom";
import { Card } from "../../components";

const Contact: FC = () => {
  return (
    <>
      <section className="contact">
        <div className="contact__wrap">
          <div className="container">
            <div className="text-content text-center mt-5 mb-3">
              <h1 className="heading">Get in touch with us</h1>
              <p className="text">
                We're here to help! Reach out by phone, email, or our contact
                form and our team will get back to you as soon as possible.
              </p>
            </div>
            <ul className="contact__list">
              <li className="contact__item">
                <Card className="contact__item-card" isLite={false}>
                  <i className="contact__item-icon bi bi-telephone-outbound"></i>
                  <h3 className="contact__item-title">By phone</h3>
                  <div className="contact__item-text">
                    <div className="contact-phone">
                      <p className="contact-phone__text">
                        For calls in Ukraine
                      </p>
                      <Link
                        className="contact__item-link"
                        to="tel:+380-1234-3421"
                      >
                        +380-1234-3421
                      </Link>
                    </div>
                    <div className="contact-phone mt-4">
                      <p className="contact-phone__text">For calls abroad</p>
                      <Link
                        className="contact__item-link"
                        to="tel:+310-1234-4321"
                      >
                        +310-1234-4321
                      </Link>
                    </div>
                  </div>
                </Card>
              </li>
              <li className="contact__item">
                <Card className="contact__item-card" isLite={false}>
                  <i className="contact__item-icon bi bi-envelope-at-fill"></i>
                  <h3 className="contact__item-title">By email</h3>
                  <div className="contact__item-text">
                    <Link
                      className="contact__item-link"
                      to="mailto:rocreator.help@gmail.com"
                    >
                      rocreator.help@gmail.com
                    </Link>
                  </div>
                </Card>
              </li>
              <li className="contact__item">
                <Card className="contact__item-card" isLite={false}>
                  <i className="contact__item-icon bi bi-card-text"></i>
                  <h3 className="contact__item-title">By contact form</h3>
                  <div className="contact__item-text">
                    <Link className="btn btn-primary" to="#contactForm">
                      <div className="d-flex flex-row align-items-center gap-2">
                        <span>Get in touch</span>
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </Link>
                  </div>
                </Card>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="contact contact--wave">
        <div className="container">
          <div className="contact__wrap">
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="contact-map">
        <div className="container">
          <div className="contact-map__wrap">
            <div className="text-content text-center">
              <h2 className="sub-heading">Our physical location</h2>
              <p className="text">
                123 Main Street, Kharkiv, Ukraine. Visit us during business
                hours or find us on the map below.
              </p>
            </div>
            <iframe
              className="contact-map__iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2563.7922833791818!2d36.224782075801166!3d50.01524837151235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4127a1243f9e69d1%3A0x6daed05394f03251!2z0KXQsNGA0LrRltCy0YHRjNC60LjQuSDQvdCw0YbRltC-0L3QsNC70YzQvdC40Lkg0YPQvdGW0LLQtdGA0YHQuNGC0LXRgiDRgNCw0LTRltC-0LXQu9C10LrRgtGA0L7QvdGW0LrQuA!5e0!3m2!1suk!2spl!4v1755630914306!5m2!1suk!2spl"
              allowFullScreen={true}
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* <section className="contact-map">
        <div className="contact-map__wrap">
          <div className="container">

          </div>
        </div>
      </section> */}
    </>
  );
};

export default Contact;
