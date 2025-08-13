import { protectedAxios } from "../../../utils/axiosInstances";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FC, FormEvent, useContext, useState } from "react";
import AuthContext from "../../../contexts/AuthContext";
import { ErrorAlert, Input } from "../../../components";
import { UpdateUserProfileDto } from "../../../types";
import { useCustomForm } from "../../../hooks";
import { API_URL } from "../../../variables";

const UpdateUserProfileForm: FC = () => {
  const navigate = useNavigate();
  const { user, refreshUserData } = useContext(AuthContext);
  const [formData, setFormData] = useState<UpdateUserProfileDto>({
    userName: user?.userName || "",
    phoneNumber: user?.phoneNumber || "",
    city: user?.city || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({
    userName: "",
    phoneNumber: "",
    city: "",
  });
  const [requestError, setRequestError] = useState<string>("");
  const { handleChange } = useCustomForm(setFormData);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (!isValid()) return;

    try {
      await protectedAxios.put(`${API_URL}/Auth/`, formData);

      refreshUserData();
      navigate("/dashboard", {
        state: {
          message: "Profile was updated successfully.",
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRequestError(
          error.response?.data?.message ||
            "Failed to update the profile. Please, try again later!"
        );
      } else {
        setRequestError("An unexpected error occurred");
      }
    }
  }

  function handleReset(): void {
    setFormData({
      userName: user?.userName || "",
      phoneNumber: user?.phoneNumber || "",
      city: user?.city || "",
    });
    setErrors({
      userName: "",
      phoneNumber: "",
      city: "",
    });
  }

  const isValid = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.userName.trim().length < 1)
      newErrors.userName = "User name should be at least 1 character long";
    if (formData.phoneNumber.length < 7)
      newErrors.phoneNumber =
        "Phone number should be at least 7 characters long";
    else if (formData.phoneNumber.length > 40)
      newErrors.phoneNumber =
        "Phone number should not be longer than 40 characters";
    if (formData.city.trim().length < 1)
      newErrors.phoneNumber = "Phone number should be longer than 1 characters";
    else if (formData.city.trim().length > 80)
      newErrors.city = "City should not be longer than 80 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form
      className="form dashboard__form"
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-labelledby="updateUserProfileForm"
    >
      {requestError && (
        <ErrorAlert className="mb-2" errorMessage={requestError} />
      )}
      <div className="mb-3">
        <label htmlFor="userName" className="form-label">
          User name
        </label>
        <Input
          name="userName"
          id="userName"
          value={formData.userName}
          onChange={handleChange}
          isRequired={true}
        />
        {errors.userName && <ErrorAlert errorMessage={errors.userName} />}
      </div>
      <div className="mb-3">
        <label htmlFor="phoneNumber" className="form-label">
          Phone number
        </label>
        <Input
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          isRequired={true}
        />
        {errors.phoneNumber && <ErrorAlert errorMessage={errors.phoneNumber} />}
      </div>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">
          City name
        </label>
        <Input
          name="city"
          id="city"
          value={formData.city}
          onChange={handleChange}
          isRequired={true}
        />
        {errors.city && <ErrorAlert errorMessage={errors.city} />}
      </div>
      <div className="form-buttons mt-2">
        <button type="submit" className="btn btn-secondary">
          Submit Changes
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
    </form>
  );
};

export default UpdateUserProfileForm;
