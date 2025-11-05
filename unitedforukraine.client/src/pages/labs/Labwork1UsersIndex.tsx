import { FC } from "react";
import { UsersTable } from "../../containers";
import { SectionHeadline } from "../../components";

const Labwork1UsersIndex: FC = () => {
  return (
    <section className="lab mt-5" id="lab">
      <div className="container">
        <div className="lab__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Labwork 1"
            title="Users"
            headingClassName="heading"
          />
          <UsersTable showPaginationButtons={true} />
        </div>
      </div>
    </section>
  );
};

export default Labwork1UsersIndex;
