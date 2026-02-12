import axios from "axios";
import type { FC } from "react";
import { useState } from "react";
import { type ContactFormData } from "../../../types";
import { ErrorAlert, Input } from "../../../components";
import { useCustomForm, useFormSubmission } from "../../../hooks";

const API_ENDPOINT: string = import.meta.env.VITE_SPREADSHEET_API_ENDPOINT;

const getDefaultFormData = (): ContactFormData => ({
  name: "",
  email: "",
  subject: "",
  message: "",
  messageDate: "",
});

const ContactForm: FC = () => {
  const [formData, setFormData] =
    useState<ContactFormData>(getDefaultFormData());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");

  const { handleChange } = useCustomForm(setFormData);
  const [handleSubmit, isPending] = useFormSubmission(
    async function (): Promise<void> {
      if (!isValid()) return;
      setRequestError("");

      try {
        const currentDate: string = new Date().toISOString();
        const payload = { ...formData, messageDate: currentDate };

        const response = await axios.post(API_ENDPOINT, payload);
        if (response.status === 201) handleReset();
      } catch (error) {
        console.log("Error submitting the form:", error);
        setRequestError(
          "There was an error submitting the form. Please, try again later!",
        );
      }
    },
  );

  const isValid = (): boolean => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }
    if (!formData.subject || formData.subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters long.";
    }
    if (
      !formData.message ||
      formData.message.length < 8 ||
      formData.message.length > 2000
    ) {
      newErrors.message = "Message must be between 8 and 2000 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = (): void => {
    setFormData(getDefaultFormData());
    setErrors({});
    setRequestError("");
  };

  return (
    <form
      id="contactForm"
      className="form contact__form"
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      {requestError.trim().length > 0 && (
        <ErrorAlert className="mb-3" errorMessage={requestError} />
      )}
      <div className="mb-3">
        <label htmlFor="nameInput" className="form-label">
          Name*
        </label>
        <Input
          type="text"
          id="nameInput"
          name="name"
          value={formData.name}
          onChange={handleChange}
          minLength={2}
          placeholder="Enter your name: "
          isRequired
        />
        {errors.name && <ErrorAlert errorMessage={errors.name} />}
      </div>
      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label">
          Email*
        </label>
        <Input
          type="email"
          id="emailInput"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address: "
          isRequired
        />
        {errors.email && <ErrorAlert errorMessage={errors.email} />}
      </div>
      <div className="mb-3">
        <label htmlFor="subjectInput" className="form-label">
          Subject*
        </label>
        <Input
          type="text"
          id="subjectInput"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Enter the subject of your message: "
          isRequired
        />
        {errors.subject && <ErrorAlert errorMessage={errors.subject} />}
      </div>
      <div className="mb-3">
        <label htmlFor="message" className="form-label">
          Message*
        </label>
        <textarea
          className="form-control"
          rows={6}
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Enter the content of your message: "
          required
        />
        {errors.message && <ErrorAlert errorMessage={errors.message} />}
      </div>
      <div id="formHelpBlock" className="form-text mb-3">
        All fields marked with an asterisk (*) are required.
      </div>
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </button>
        <button
          type="reset"
          className="btn btn-outline-danger"
          disabled={isPending}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
