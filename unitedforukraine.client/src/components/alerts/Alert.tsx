import { FC } from "react";

export interface IAlertProps {
  className?: string;
  message: string;
}

const Alert: FC<IAlertProps> = ({ className, message }) => {
  return (
    <div className={`${className + " " || " "}alert alert-info`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
