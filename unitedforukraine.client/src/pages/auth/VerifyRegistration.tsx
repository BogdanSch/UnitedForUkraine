import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, ErrorAlert } from "../../components";
import { API_URL } from "../../variables";

const VerifyRegistration: FC = () => {
  const navigate = useNavigate();
  const [requestError, setRequestError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const token: string | null = searchParams.get("token");
  const email: string | null = searchParams.get("email");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !email) {
        setRequestError("Invalid verification link.");
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/auth/emailConfirmation?token=${token}&email=${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 204) {
          throw new Error("Failed to verify email address.");
        }

        setRequestError(null);
        navigate("/auth/login", {
          state: {
            message: "Email verification successful. You can now log in!",
          },
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setRequestError(
            error.response?.data?.message || "An error has occurred."
          );
        } else {
          console.error(`Error verifying the email: ${error}`);
        }
      }
    };

    verifyEmail();
  }, [token, email]);

  return (
    <section
      className={`registration ${
        requestError ? "registration--error" : "registration--success"
      }`}
    >
      <div className="container">
        <Card isLite={true} className="registration__wrap p-4">
          <svg className="registration__icon">
            <use
              xlinkHref={`#${requestError ? "errorIcon" : "successIcon"}`}
            ></use>
          </svg>
          <div className="registration__body">
            <h2 className="registration__title">
              Verifying your email address
            </h2>
            <p className="registration__message">
              We are currently verifying your email address. This process may
              take a few moments. Any errors will be displayed here.
            </p>
            {requestError && <ErrorAlert errorMessage={requestError} />}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default VerifyRegistration;
