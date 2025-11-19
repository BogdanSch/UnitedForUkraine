import { FC } from "react";
import { UsersTable } from "../../containers";
import { SectionHeadline } from "../../components";

const UsersIndex: FC = () => {
  return (
    <section className="dashboard mt-5">
      <div className="container">
        <div className="dashboard__wrap">
          <SectionHeadline
            sectionIndicatorTitle="Dashboard"
            title="Users"
            headingClassName="heading"
          />
          <UsersTable showPaginationButtons={true} />
        </div>
      </div>
    </section>
  );
};

export default UsersIndex;
