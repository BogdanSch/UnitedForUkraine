import { FC } from "react";
import { IAlertProps } from "./Alert";

interface IErrorAlertProps extends Omit<IAlertProps, "message"> {
  errorMessage: string;
}

const ErrorAlert: FC<IErrorAlertProps> = ({ className, errorMessage }) => {
  return (
    <div
      className={`${className + " " || " "}alert alert-danger mt-2`}
      role="alert"
    >
      {errorMessage}
    </div>
  );
};

export default ErrorAlert;
