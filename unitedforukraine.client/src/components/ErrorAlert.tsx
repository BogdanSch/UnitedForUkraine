import { FC } from "react";

interface ErrorAlertProps {
  className?: string;
  errorMessage: string;
}

const ErrorAlert: FC<ErrorAlertProps> = ({ className, errorMessage }) => {
  return (
    <div className={`${className || ""} alert alert-danger mt-2`} role="alert">
      {errorMessage}
    </div>
  );
};

export default ErrorAlert;
