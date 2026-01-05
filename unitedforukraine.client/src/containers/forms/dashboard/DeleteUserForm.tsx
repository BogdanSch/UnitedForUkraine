import axios from "axios";
import { protectedAxios } from "../../../utils/axiosInstances";
import { useNavigate } from "react-router-dom";
import { FC, FormEvent, useContext, useRef, useEffect, useState } from "react";
import { Modal } from "bootstrap";
import AuthContext from "../../../contexts/AuthContext";
import { API_URL } from "../../../variables";
import { useCustomForm, useAuthForm } from "../../../hooks";
import { ErrorAlert, Input, PasswordInput } from "../../../components";
import { DeleteUserDto } from "../../../types";
import { isNullOrWhitespace } from "../../../utils/helpers/stringHelper";

const getFormData = (): DeleteUserDto => {
  return {
    password: "",
    confirmEmail: "",
  };
};

const DeleteUserForm: FC = () => {
  const [hasPassword, setHasPassword] = useState<boolean>(true);

  const modalElementRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { user, isAuthenticated, logoutUser } = useContext(AuthContext);
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    requestError,
    setRequestError,
  } = useAuthForm(getFormData());
  const { handleChange } = useCustomForm(setFormData);

  useEffect(() => {
    userHasPassword()
      .then((hasPassword) => {
        setHasPassword(hasPassword);
      })
      .catch(() => {
        navigate("/home");
      });
  }, [navigate]);

  const userHasPassword = async (): Promise<boolean> => {
    try {
      const response = await protectedAxios.get<{ hasPassword: boolean }>(
        `${API_URL}/Auth/me/has-password`
      );
      return response.data.hasPassword;
    } catch (error) {
      console.error("Error checking password:", error);
      return false;
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!isAuthenticated()) return;
    if (!isValid()) return;

    try {
      await protectedAxios.delete(`${API_URL}/Auth`, {
        data: formData,
      });
      const modalElement = modalElementRef.current;
      if (modalElement) {
        const modal =
          Modal.getInstance(modalElement!) ?? new Modal(modalElement!);
        modal.hide();
      }

      navigate("/home", {
        state: {
          message:
            "Profile was successfully deleted. We're sorry that you had to leave us",
        },
      });

      setTimeout(async () => await logoutUser(), 200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.password) {
          setErrors({
            password: data?.password,
          });
        } else if (data?.confirmEmail) {
          setErrors({
            confirmEmail: data?.confirmEmail,
          });
        } else {
          setRequestError(
            error.response?.data?.message ||
              "Deletion failed. Please, try again later!"
          );
        }
      } else {
        setRequestError("An unexpected error has occurred!");
      }
    }
  };

  const isValid = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.confirmEmail !== user?.email) {
      newErrors.confirmEmail = "Email addresses do not match!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className="dashboard__modal modal fade"
      id="deleteUserModal"
      ref={modalElementRef}
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">Delete account</h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {!isNullOrWhitespace(requestError) && (
              <ErrorAlert className="mb-4" errorMessage={requestError} />
            )}
            <form
              className="form dashboard__form"
              id="deleteUserForm"
              aria-labelledby="delete user form"
              onSubmit={handleSubmit}
            >
              <div className="form-group mb-3">
                <label htmlFor="confirmEmailInput" className="form-label">
                  Confirm your email address*:
                </label>
                <Input
                  type="email"
                  name="confirmEmail"
                  id="confirmEmailInput"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  isRequired
                />
                {!isNullOrWhitespace(errors.confirmEmail) && (
                  <ErrorAlert errorMessage={errors.confirmEmail} />
                )}
              </div>
              {hasPassword && (
                <div className="form-group">
                  {" "}
                  <label htmlFor="password" className="form-label">
                    Confirm your password*:
                  </label>
                  <PasswordInput
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {!isNullOrWhitespace(errors.password) && (
                    <ErrorAlert errorMessage={errors.password} />
                  )}
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              form="deleteUserForm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;
