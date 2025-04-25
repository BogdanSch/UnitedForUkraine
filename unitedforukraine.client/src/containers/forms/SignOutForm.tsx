// import axios from "axios";
import { FC, FormEvent, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
// import { API_URL } from "../../variables";

const SignOutForm: FC = () => {
  const { isAuthenticated, logoutUser } = useContext(AuthContext);

  const handleLogout = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!isAuthenticated()) return;
    try {
      // await axios.post(`${API_URL}/Auth/logout`);
      logoutUser();
    } catch (error) {
      console.error("Error: Couldn't logout the user! " + error);
    }
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
