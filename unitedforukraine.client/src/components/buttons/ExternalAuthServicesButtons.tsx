import { FC, MouseEvent } from "react";
import { API_URL } from "../../variables";

const ExternalAuthServicesButtons: FC = () => {
  const returnUrl: string = `${window.location.origin}/auth`;

  const handleGoogleSignIn = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    window.location.href = `${API_URL}/Auth/login/google?returnUrl=${returnUrl}`;
  };

  return (
    <div className="form-buttons form-buttons--full mt-2 text-center">
      <button
        type="submit"
        className="btn btn-dark form-buttons__item"
        onClick={handleGoogleSignIn}
      >
        <i className="bi bi-google"></i>
        <span className="small ms-2">Sign in with Google</span>
      </button>
    </div>
  );
};

export default ExternalAuthServicesButtons;
