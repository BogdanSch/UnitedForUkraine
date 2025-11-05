import { useState } from "react";
import useCustomForm from "./useCustomForm";

const MIN_PASSWORD_LENGTH: number = 7;

const emailValidation = /(.+)@(.+){2,}\.(.+){2,}/;
const upperCaseLettersValidation = /[A-Z]/g;
const numbersValidation = /(?=(.*\d){3})/;

export default function useAuthForm(initialState: Record<string, any>) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState("");

  const { handleChange } = useCustomForm(setFormData);

  const validateForm = (isRegisterPage = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.match(emailValidation))
      newErrors.email = "Invalid email format!";
    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password should be at least ${MIN_PASSWORD_LENGTH} characters long!`;
    } else if (!formData.password.match(upperCaseLettersValidation)) {
      newErrors.password =
        "Password should contain at least one uppercase letter!";
    } else if (!formData.password.match(numbersValidation)) {
      newErrors.password = "Password should contain at least three digits!";
    }
    if (isRegisterPage && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords should be identical!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    requestError,
    setRequestError,
    handleChange,
    validateForm,
    setFormData,
    setErrors,
  };
}
