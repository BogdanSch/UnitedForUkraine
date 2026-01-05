import React, { ChangeEvent, useState } from "react";
import Input from "./Input";

interface PasswordInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="input-group flex-nowrap password-input-wrapper">
      <Input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        className="form-password"
        value={value}
        placeholder="Enter your password"
        onChange={onChange}
        autoComplete="current-password"
        aria-describedby="passwordHelpInline"
        isRequired={true}
      />
      <button
        type="button"
        className="form-password__button input-group-text"
        onClick={handleToggleShowPassword}
      >
        {showPassword ? (
          <i className="bi bi-eye-slash-fill"></i>
        ) : (
          <i className="bi bi-eye"></i>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
