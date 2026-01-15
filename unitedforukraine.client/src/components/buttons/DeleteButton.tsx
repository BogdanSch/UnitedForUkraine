import { FC } from "react";

interface IDeleteButtonProps {
  text: string;
}

const DeleteButton: FC<IDeleteButtonProps> = ({ text }) => {
  return (
    <button
      className="btn btn-outline-danger form-buttons__item btn-icon"
      type="submit"
    >
      <span>{text}</span>
      <i className="bi bi-trash3-fill"></i>
    </button>
  );
};
export default DeleteButton;
