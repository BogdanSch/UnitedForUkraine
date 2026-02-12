import { FC, SubmitEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../variables";
import axios from "axios";

import { useAuthForm } from "../../../hooks/";
import {
  ErrorAlert,
  ExternalAuthServicesButtons,
  Input,
  OrSeparator,
  PasswordInput,
} from "../../../components";
import { TokenDateDto } from "../../../types";

const SignInForm: FC = () => {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState("");
  const options = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  const { formData, errors, handleChange, isValid, setFormData, setErrors } =
    useAuthForm({
      email: "",
      password: "",
      rememberMe: false,
    });

  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!isValid()) return;

    try {
      const { data } = await axios.post<TokenDateDto>(
        `${API_URL}/Auth/login`,
        formData,
        options,
      );

      navigate(
        `/auth/authentication?` +
          `&accessTokenExpirationTime=${encodeURIComponent(
            data.accessTokenExpirationTime,
          )}` +
          `&refreshTokenExpirationTime=${encodeURIComponent(
            data.refreshTokenExpirationTime,
          )}`,
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRequestError(
          error.response?.data.message ||
            "An error has occurred while logging in. Please, try again later!",
        );
      } else {
        console.error(`Unexpected error: ${error}`);
      }
    }
  };

  const handleReset = (): void => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });
    setErrors({
      email: "",
      password: "",
    });
  };

  return (
    <form
      className="form login__form mt-4"
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-labelledby="loginForm"
    >
      {requestError && <ErrorAlert errorMessage={requestError} />}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email*
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          placeholder="Enter email"
          onChange={handleChange}
          autoComplete="email"
          isRequired={true}
        />
        {errors.email && (
          <div className="alert alert-danger mt-1" role="alert">
            {errors.email}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password*
        </label>
        <PasswordInput value={formData.password} onChange={handleChange} />
        <div id="passwordHelpBlock" className="form-text">
          Your password must be at least 7 characters long, contain both letters
          and numbers, include at least one uppercase letter, and must not
          contain emojis.
        </div>
        {errors.password && (
          <div className="alert alert-danger mt-1" role="alert">
            {errors.password}
          </div>
        )}
      </div>
      <div className="mb-3 form-check">
        <input
          type="checkbox"
          id="rememberMe"
          name="rememberMe"
          className="form-check-input"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        <label htmlFor="rememberMe" className="form-check-label">
          Remember Me
        </label>
      </div>
      <div id="passwordHelpBlock" className="form-text">
        All fields marked with an asterisk (*) are required.
      </div>
      <div className="form-buttons mt-2">
        <button type="submit" className="btn btn-secondary">
          Login
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
      <OrSeparator />
      <ExternalAuthServicesButtons />
    </form>
  );
};

export default SignInForm;
