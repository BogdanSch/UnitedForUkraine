import axios from "axios";
import { FC, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../variables";

import {
  ConfirmPasswordInput,
  ErrorAlert,
  Input,
  PasswordInput,
} from "../../../components";
import { useAuthForm } from "../../../hooks";

const RegisterForm: FC = () => {
  const clientUri: string = `${window.location.origin}/auth/verifyRegistration`;
  const navigate = useNavigate();

  const [requestError, setRequestError] = useState<string>("");
  const {
    formData,
    errors,
    handleChange,
    validateForm,
    setFormData,
    setErrors,
  } = useAuthForm({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    confirmEmailClientUri: clientUri,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm(true)) {
      const options = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      try {
        await axios.post(`${API_URL}/Auth/register`, formData, options);
        navigate("/auth/registered");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setRequestError(
            error.response?.data.message ||
              "An error has occurred while registering. Please try again later!"
          );
        } else {
          console.error(`Unexpected error: ${error}`);
        }
      }
    }
  };

  const handleReset = (): void => {
    setFormData({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      confirmEmailClientUri: clientUri,
    });
    setErrors({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
  };

  return (
    <form
      className="form register__form mt-4"
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-labelledby="registerForm"
    >
      {requestError && (
        <ErrorAlert className="mb-2" errorMessage={requestError} />
      )}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Username*
        </label>
        <Input
          type="text"
          id="userName"
          name="userName"
          className="form-control"
          value={formData.userName}
          placeholder="Enter user name: "
          onChange={handleChange}
          autoComplete="username"
          isRequired={false}
        />
        {errors.userName && (
          <div className="alert alert-danger mt-1" role="alert">
            {errors.userName}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email*
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Enter email address: "
          className="form-control"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          isRequired={false}
        />
        {errors.email && (
          <div className="alert alert-danger mt-1" role="alert">
            {errors.email}
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Phone number*
        </label>
        <Input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter phone number: "
          className="form-control"
          value={formData.phoneNumber}
          onChange={handleChange}
          autoComplete="tel"
          isRequired={true}
        />
        {errors.phoneNumber ? (
          <div className="alert alert-danger mt-1" role="alert">
            {errors.phoneNumber}
          </div>
        ) : (
          <div id="phoneNumberHelp" className="form-text">
            Phone number must be between 7 and 40 characters long. Include
            country code, e.g., +380931234567.
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
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password*
        </label>
        <ConfirmPasswordInput
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && (
          <div className="alert alert-danger mt-1" role="alert">
            {errors.confirmPassword}
          </div>
        )}
      </div>
      <div id="formHelpBlock" className="form-text">
        All fields marked with an asterisk (*) are required.
      </div>
      <div className="form-buttons mt-2">
        <button type="submit" className="btn btn-secondary">
          Register
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
