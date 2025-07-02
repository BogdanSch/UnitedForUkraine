import { FC } from "react";
import { UpdateUserProfileForm } from "../../containers";

const UpdateUserProfile: FC = () => {
  return (
    <section className="dashboard">
      <div className="container">
        <div className="dashboard__wrap">
          <div className="text-content">
            <h1 className="heading">Update User Profile</h1>
            <p className="dashboard__description">
              This page will allow users to update their profile information.
            </p>
          </div>
          <UpdateUserProfileForm />
        </div>
      </div>
    </section>
  );
};
export default UpdateUserProfile;
