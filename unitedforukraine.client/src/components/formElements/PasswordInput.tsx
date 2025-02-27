import React, { ChangeEvent, useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleShowPassword = () => setShowPassword(!showPassword);

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
  //   onChange(e);

  return (
    <div className="input-group flex-nowrap password-input-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        className="form-control form-password"
        value={value}
        placeholder="Enter password"
        onChange={onChange}
        autoComplete="current-password"
        aria-describedby="passwordHelpInline"
        required
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
