import { protectedAxios } from "../../../utils/axiosInstances";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FC, FormEvent, useContext, useState } from "react";
import AuthContext from "../../../contexts/AuthContext";
import { ErrorAlert, Input } from "../../../components";
import { UpdateUserProfileDto, UserDto } from "../../../types";
import { useCustomForm } from "../../../hooks";
import { API_URL } from "../../../variables";

const getFormData = (user: UserDto | null): UpdateUserProfileDto => {
  return {
    userName: user?.userName || "",
    phoneNumber: user?.phoneNumber || "",
    updatedAddress: {
      city: user?.address.city || "",
      region: user?.address.region || "",
      country: user?.address.country || "",
      street: user?.address.street || "",
      postalCode: user?.address.postalCode || "",
    },
  };
};

const UpdateUserProfileForm: FC = () => {
  const navigate = useNavigate();

  const { user, refreshUserData } = useContext(AuthContext);
  const [formData, setFormData] = useState<UpdateUserProfileDto>(
    getFormData(user)
  );
  const { handleChange, handleNestedChange } = useCustomForm(setFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");

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
      updatedAddress: {
        city: "",
        region: "",
        country: "",
        street: "",
        postalCode: "",
      },
    });
    setErrors({});
  }

  const isValid = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.userName.trim().length < 1)
      newErrors.userName = "The user name should be at least 1 character long";
    if (formData.phoneNumber.length < 7)
      newErrors.phoneNumber =
        "The phone number should be at least 7 characters long";
    else if (formData.phoneNumber.length > 40)
      newErrors.phoneNumber =
        "The phone number should not be longer than 40 characters";
    if (formData.updatedAddress.city.trim().length > 100)
      newErrors.city = "The city name should be shorter than 100 characters";
    if (formData.updatedAddress.country.trim().length > 80)
      newErrors.country =
        "The country name should be shorter than 80 characters";
    if (formData.updatedAddress.region.trim().length > 100)
      newErrors.region =
        "The region name should be shorter than 100 characters";
    if (formData.updatedAddress.street.trim().length > 120)
      newErrors.street =
        "The street name should be shorter than 120 characters";
    if (formData.updatedAddress.postalCode.trim().length > 20)
      newErrors.street = "The postal code should be shorter than 20 characters";

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
          Your user name
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
          Your phone number
        </label>
        <Input
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          isRequired={true}
        />
        {errors.phoneNumber && <ErrorAlert errorMessage={errors.phoneNumber} />}
        <div id="phoneNumberHelp" className="form-text">
          Phone number must be between 7 and 40 characters long. Include country
          code, e.g., +380931234567.
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="country" className="form-label">
          Your country name
        </label>
        <Input
          name="updatedAddress.country"
          id="country"
          value={formData.updatedAddress.country}
          onChange={handleNestedChange}
          isRequired={false}
        />
        {errors.country && <ErrorAlert errorMessage={errors.country} />}
      </div>
      <div className="mb-3">
        <label htmlFor="region" className="form-label">
          Your region name
        </label>
        <Input
          name="updatedAddress.region"
          id="region"
          value={formData.updatedAddress.region}
          onChange={handleNestedChange}
          isRequired={false}
        />
        {errors.region && <ErrorAlert errorMessage={errors.region} />}
      </div>
      <div className="mb-3">
        <label htmlFor="city" className="form-label">
          Your city name
        </label>
        <Input
          name="updatedAddress.city"
          id="city"
          value={formData.updatedAddress.city}
          onChange={handleNestedChange}
          isRequired={false}
        />
        {errors.city && <ErrorAlert errorMessage={errors.city} />}
      </div>
      <div className="mb-3">
        <label htmlFor="street" className="form-label">
          Your street name
        </label>
        <Input
          name="updatedAddress.street"
          id="street"
          value={formData.updatedAddress.street}
          onChange={handleNestedChange}
          isRequired={false}
        />
        {errors.street && <ErrorAlert errorMessage={errors.street} />}
      </div>
      <div className="mb-3">
        <label htmlFor="postalCode" className="form-label">
          Your postal code
        </label>
        <Input
          name="updatedAddress.postalCode"
          id="postalCode"
          value={formData.updatedAddress.postalCode}
          onChange={handleNestedChange}
          isRequired={false}
        />
        {errors.postalCode && <ErrorAlert errorMessage={errors.postalCode} />}
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
