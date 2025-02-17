import { FC, useState, ChangeEvent, FormEvent } from "react";
import { API_URL } from "../../variables";
import axios, { AxiosError } from "axios";
import { Image } from "../../components";

const LoginPage: FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <section className="login">
      <div className="container">
        <div className="login__wrap">
          <Image className="login__hero-image" src={``} alt={``} />
          <div className="login__hero-content">
            <div className="text-content">
              <h2 className="login__title">Welcome back!</h2>
              <p className="login__description">We have missed you so much!</p>
            </div>
            <form
              className="login__form"
              onSubmit={handleSubmit}
              aria-labelledby="loginForm"
            >
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={(e) => console.log(e)}>
                    <i className="fa fa-eye"></i>
                  </button>
                </div>
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
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
