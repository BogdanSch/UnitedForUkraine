import { FC } from "react";
import { SectionHeadline } from "../../components";
import { CreateNewsUpdateForm } from "../../containers";

const NewsUpdatesCreate: FC = () => {
  return (
    <section className="news">
      <div className="container">
        <div className="news__wrap">
          <SectionHeadline
            className="mb-5"
            title="Create a new News update"
            sectionIndicatorTitle="News"
            description="Fill out the form below to add a new news update to the catalog."
          />
          <CreateNewsUpdateForm />
        </div>
      </div>
    </section>
  );
};

export default NewsUpdatesCreate;
