import React, { ChangeEvent } from "react";

interface InputProps {
  className: string | "";
  name: string;
  id: string;
  isRequired: boolean;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  [name: string]: any;
}

const Input: React.FC<InputProps> = ({
  className,
  name,
  id,
  isRequired,
  value,
  onChange,
  placeholder,
  ...rest
}) => {
  return (
    <input
      id={id}
      name={name}
      className={`form-control ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={isRequired}
      {...rest}
    />
  );
};

export default Input;
