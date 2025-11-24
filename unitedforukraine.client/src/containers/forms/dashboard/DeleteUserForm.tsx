import axios from "axios";
import { protectedAxios } from "../../../utils/axiosInstances";
import { useNavigate } from "react-router-dom";
import { FC, FormEvent, useContext, useRef } from "react";
import { Modal } from "bootstrap";
import AuthContext from "../../../contexts/AuthContext";
import { API_URL } from "../../../variables";
import { useCustomForm, useAuthForm } from "../../../hooks";
import { ErrorAlert, PasswordInput } from "../../../components";
import { DeleteUserDto, UserDto } from "../../../types";
import { isNullOrWhitespace } from "../../../utils/helpers/stringHelper";

const getFormData = (user: UserDto | null): DeleteUserDto => {
  return {
    email: user?.email || "",
    password: "",
  };
};

const DeleteUserForm: FC = () => {
  const navigate = useNavigate();
  const modalElementRef = useRef<HTMLDivElement | null>(null);

  const { user, isAuthenticated, logoutUser } = useContext(AuthContext);

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    requestError,
    setRequestError,
  } = useAuthForm(getFormData(user));
  const { handleChange } = useCustomForm(setFormData);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (!isValid()) return;
    if (!isAuthenticated()) return;

    try {
      await protectedAxios.delete(`${API_URL}/Auth`, {
        data: {
          email: user!.email,
          password: formData.password,
        },
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

      setTimeout(async () => await logoutUser(), 100);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.password) {
          setErrors({
            password: data?.password,
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
  }
  const isValid = (): boolean => {
    const newErrors: Record<string, string> = {};

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
              <ErrorAlert errorMessage={requestError} />
            )}
            <form
              className="form dashboard__form"
              id="deleteUserForm"
              aria-labelledby="updateUserProfileForm"
              onSubmit={handleSubmit}
            >
              <fieldset className="form-group">
                <PasswordInput
                  value={formData.password}
                  onChange={handleChange}
                />
                {!isNullOrWhitespace(errors.password) && (
                  <ErrorAlert errorMessage={errors.password} />
                )}
              </fieldset>
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
