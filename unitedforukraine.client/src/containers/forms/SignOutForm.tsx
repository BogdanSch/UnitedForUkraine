import { FC, FormEvent } from "react";

const SignOutForm: FC = () => {
  const handleLogout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <form
      onSubmit={handleLogout}
      className="header__profile-form"
      role="logout"
    >
      <button type="submit" className="btn btn-outline-danger">
        Sign out
      </button>
    </form>
  );
};

export default SignOutForm;
