import { FC } from "react";
import { SectionHeadline } from "../../components";
import { NewsUpdatesList } from "../../containers";

const NewsUpdatesIndex: FC = () => {
  return (
    <section className="news mt-5" id="newsUpdates">
      <div className="container">
        <div className="news__wrap">
          <SectionHeadline
            sectionIndicatorTitle="News and Updates"
            title="The United For Ukraine's Current News updates"
            headingClassName="news__title"
            description="Stay informed with the latest news and updates on our foundation platform. Here you will find timely announcements, progress reports, and inspiring stories from our ongoing initiatives. We regularly update this page to keep our community engaged and informed about the impact of your support. Together, we can make a difference."
          />
          <NewsUpdatesList
            showQueryCriteria={true}
            showPaginationButtons={true}
          />
        </div>
      </div>
    </section>
  );
};

export default NewsUpdatesIndex;
