import { FC, useState, ChangeEvent, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../variables";
import axios, { AxiosError } from "axios";

import PasswordInput from "../../components/formElements/PasswordInput";
import AuthContext from "../../contexts/AuthContext";
import { ConfirmPasswordInput } from "../../components";

const MIN_PASSWORD_LENGTH: number = 7;

const RegisterForm: FC = () => {
  const navigate = useNavigate();
  const { authenticateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    isFormValid: true,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleValidation = (): boolean => {
    let newErrors = {
      email: "",
      password: "",
      confirmPassword: "",
      isFormValid: true,
    };

    const emailValidation: RegExp = /(.+)@(.+){2,}\.(.+){2,}/;

    if (!formData.email.match(emailValidation)) {
      newErrors.email = "Invalid email format!";
      newErrors.isFormValid = false;
    }

    const upperCaseLettersValidation: RegExp = /[A-Z]/g;
    const numbersValidation: RegExp = /(?=(.*\d){3})/;

    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password should be at least ${MIN_PASSWORD_LENGTH} characters long!`;
      newErrors.isFormValid = false;
    } else if (!formData.password.match(upperCaseLettersValidation)) {
      newErrors.password =
        "Password should contain at least one capital (uppercase) letter!";
      newErrors.isFormValid = false;
    } else if (!formData.password.match(numbersValidation)) {
      newErrors.password =
        "Password should contain at least three digits (0-9)!";
      newErrors.isFormValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = `Passwords should be identical!`;
      newErrors.isFormValid = false;
    }
    setErrors(newErrors);
    return newErrors.isFormValid;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (handleValidation()) {
      console.log("Form validated!");

      const options = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      try {
        const response = await axios.post(
          `${API_URL}/Auth/register`,
          formData,
          options
        );

        const authToken: string = response.data;
        authenticateUser(authToken);
        navigate("/dashboard");
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            error.response?.data.message || "An error has occurred"
          );
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  function handleReset(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    });

    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      isFormValid: true,
    });
  }

  return (
    <form
      className="register__form mt-5"
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-labelledby="registerForm"
    >
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email*
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-control"
          value={formData.email}
          placeholder="Enter email"
          onChange={handleChange}
          autoComplete="email"
          required
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
        <label htmlFor="password" className="form-label">
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
      <div className="register__form-buttons mt-2">
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
