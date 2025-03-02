import { FC, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../variables";
import axios, { AxiosError } from "axios";

import PasswordInput from "../../components/formElements/PasswordInput";
import { ConfirmPasswordInput, Input } from "../../components";
import { useAuthForm } from "../../hooks";

const RegisterForm: FC = () => {
  const navigate = useNavigate();

  const [requestError, setRequestError] = useState("");
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
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm(true)) {
      console.log("Form validated!");

      const options = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      try {
        await axios.post(`${API_URL}/Auth/register`, formData, options);
        navigate("/registered");
      } catch (error) {
        if (error instanceof AxiosError) {
          setRequestError(
            error.response?.data.message || "An error has occurred"
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleReset = (event: FormEvent<HTMLFormElement>): void => {
    // event.preventDefault();
    setFormData({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setErrors({
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <form
      className="register__form mt-4"
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-labelledby="registerForm"
    >
      {requestError && (
        <div className="alert alert-danger" role="alert">
          {requestError}
        </div>
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
          placeholder="Enter user name"
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
          className="form-control"
          value={formData.email}
          placeholder="Enter email"
          onChange={handleChange}
          autoComplete="email"
          required={true}
          isRequired={false}
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
          Your password must be 7 or more characters long, contain letters and
          numbers, and must not contain emoji.
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
      <div className="register__form-buttons mt-2">
        <button type="submit" className="btn btn-secondary">
          Register
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
      <div className="mt-4 text-center">
        <p>
          Already have an account? <Link to="/auth/login">Sign in here</Link>.
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
