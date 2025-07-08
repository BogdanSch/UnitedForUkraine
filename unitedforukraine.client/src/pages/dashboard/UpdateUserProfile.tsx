import { FC } from "react";
import { UpdateUserProfileForm } from "../../containers";
import { Image } from "../../components";
import updateProfileImage from "/assets/img/readingNewspaper.jpg";

const UpdateUserProfile: FC = () => {
  return (
    <section className="dashboard">
      <div className="container">
        <div className="dashboard__wrap">
          <div className="text-content text-center mt-5 mb-4">
            <Image
              containerClassName="dashboard__image-container mb-2"
              imageClassName="dashboard__image"
              src={updateProfileImage}
              alt={"A man patiently reads the newspaper"}
            />
            <h1 className="heading">Update Personal Information</h1>
            <p className="dashboard__description">
              This page allows users to update their profile information. You
              can change your user name, phone number, and city.
            </p>
          </div>
          <UpdateUserProfileForm />
        </div>
      </div>
    </section>
  );
};
export default UpdateUserProfile;
