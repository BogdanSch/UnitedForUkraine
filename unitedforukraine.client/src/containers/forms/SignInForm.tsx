import { FC, FormEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../variables";
import axios, { AxiosError } from "axios";

import PasswordInput from "../../components/formElements/PasswordInput";
import AuthContext from "../../contexts/AuthContext";
import { useAuthForm } from "../../hooks/";
import { Input } from "../../components";

const SignInForm: FC = () => {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const {
    formData,
    errors,
    handleChange,
    validateForm,
    setFormData,
    setErrors,
  } = useAuthForm({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateForm()) {
      console.log("Form validated!");

      const options = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      try {
        const response = await axios.post(
          `${API_URL}/Auth/login`,
          formData,
          options
        );

        const authToken: string = response.data;
        authenticateUser(authToken);
        navigate("/dashboard");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response?.data.message || "An error occurred");
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  const handleReset = (event: FormEvent<HTMLFormElement>): void => {
    // event.preventDefault();

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
      className="login__form mt-4"
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-labelledby="loginForm"
    >
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
          Your password must be 7 or more characters long, contain letters and
          numbers, and must not contain emoji.
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
      <div className="login__form-buttons mt-2">
        <button type="submit" className="btn btn-secondary">
          Login
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
      <div className="mt-4 text-center">
        <p>
          Don't have an account? <Link to="/auth/register">Sign up here</Link>.
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
