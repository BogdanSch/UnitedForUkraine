import { FC } from "react";
import { useParams } from "react-router-dom";
import { SectionHeadline } from "../../components";
import { EditNewsUpdateForm } from "../../containers";

const NewsUpdateEdit: FC = () => {
  let { id } = useParams();
  return (
    <section className="news">
      <div className="container">
        <div className="news__wrap">
          <SectionHeadline
            className="mb-5"
            title="Edit the existing News update"
            sectionIndicatorTitle="News"
            description="Fill out the form below to edit the current news update."
          />
          <EditNewsUpdateForm id={Number(id)} />
        </div>
      </div>
    </section>
  );
};

export default NewsUpdateEdit;
