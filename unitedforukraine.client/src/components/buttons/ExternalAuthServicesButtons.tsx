import { FC, MouseEvent } from "react";
import { API_URL } from "../../variables";

const ExternalAuthServicesButtons: FC = () => {
  const returnUrl: string = `${window.location.origin}/auth/authentication`;

  const handleExternalSignIn = (
    event: MouseEvent<HTMLButtonElement>,
    provider: string
  ): void => {
    event.preventDefault();
    window.location.href = `${API_URL}/Auth/login/${provider}?returnUrl=${returnUrl}`;
  };
  return (
    <div className="form-buttons form-buttons--full mt-2 text-center">
      <button
        type="submit"
        className="btn btn-dark form-buttons__item"
        onClick={(event) => handleExternalSignIn(event, "google")}
      >
        <i className="bi bi-google"></i>
        <span className="small ms-2">Sign in with Google</span>
      </button>
      {/* <button
        type="submit"
        className="btn btn-outline-dark form-buttons__item"
        onClick={(event) => handleExternalSignIn(event, "microsoft")}
      >
        <i className="bi bi-microsoft"></i>
        <span className="small ms-2">Sign in with Microsoft</span>
      </button> */}
      <button
        type="submit"
        className="btn btn-outline-dark form-buttons__item"
        onClick={(event) => handleExternalSignIn(event, "facebook")}
      >
        <i className="bi bi-facebook"></i>
        <span className="small ms-2">Sign in with Facebook</span>
      </button>
    </div>
  );
};

export default ExternalAuthServicesButtons;
