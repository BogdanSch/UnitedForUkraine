import { useState, type SubmitEvent } from "react";
type UseFormSubmission = [
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void,
  isSubmitting: boolean,
];

export default function useFormSubmission(
  callback: (event: SubmitEvent<HTMLFormElement>) => void | Promise<void>,
): UseFormSubmission {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const handleSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await callback(event);
    } finally {
      setIsSubmitting(false);
    }
  };
  return [handleSubmit, isSubmitting];
}
