import axios from "axios";
import { FC, FormEvent, useState } from "react";
import { ContactFormData } from "../../../types";
import { ErrorAlert } from "../../../components";
import { useCustomForm } from "../../../hooks";

const API_ENDPOINT: string = import.meta.env.VITE_SPREADSHEET_API_ENDPOINT;

const DEFAULT_FORM_DATA: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  messageDate: "",
};

const ContactForm: FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [requestError, setRequestError] = useState<string>("");

  const { handleChange } = useCustomForm(setFormData);

  const isValid = (): boolean => {
    setErrors({});
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }
    if (!formData.subject || formData.subject.length < 2) {
      newErrors.subject = "Subject must be at least 2 characters long.";
    }
    if (
      !formData.message ||
      formData.message.length < 8 ||
      formData.message.length > 1000
    ) {
      newErrors.message = "Message must be between 8 and 1000 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setRequestError("");

    if (!isValid()) return;

    try {
      const currentDate: string = new Date().toISOString();

      const payload = { ...formData, messageDate: currentDate };
      let response = await axios.post(API_ENDPOINT, payload);

      if (response.status === 201) setFormData(DEFAULT_FORM_DATA);
    } catch (error) {
      console.log("Error submitting the form:", error);
      setRequestError(
        "There was an error submitting the form. Please, try again later!"
      );
    }
  };

  const handleReset = (): void => {
    setFormData(DEFAULT_FORM_DATA);
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
        <label htmlFor="name" className="form-label">
          Name*
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          minLength={2}
          placeholder="Enter your name: "
          required
        />
        {errors.name && <ErrorAlert errorMessage={errors.name} />}
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email*
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address: "
          required
        />
        {errors.email && <ErrorAlert errorMessage={errors.email} />}
      </div>
      <div className="mb-3">
        <label htmlFor="subject" className="form-label">
          Subject*
        </label>
        <input
          type="text"
          className="form-control"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Enter the subject of your message: "
          required
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
        {errors.subject && <ErrorAlert errorMessage={errors.subject} />}
      </div>
      <div id="formHelpBlock" className="form-text mb-3">
        All fields marked with an asterisk (*) are required.
      </div>
      <div className="form-buttons">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Reset
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
