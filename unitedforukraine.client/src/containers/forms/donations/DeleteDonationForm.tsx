import { protectedAxios } from "../../../utils/axiosInstances";
import { Dispatch, FC, FormEvent, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../variables";
import { DonationDto } from "../../../types";

interface IDeleteDonationFormProps {
  id: number;
  setDonations: Dispatch<SetStateAction<DonationDto[]>>;
}
const DeleteDonationForm: FC<IDeleteDonationFormProps> = ({
  id,
  setDonations,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      await protectedAxios.delete(`${API_URL}/donations/${id}`);
      setDonations((prev) => prev.filter((donation) => donation.id !== id));
      navigate(`/dashboard/donations`, {
        state: {
          message: "Donation was successfully deleted.",
        },
      });
    } catch (error) {
      console.error(`Error deleting the donation: ${error}`);
    }
  };

  return (
    <form className="form donations__delete-form" onSubmit={handleSubmit}>
      <div className="form-buttons">
        <button
          className="btn btn-outline-danger form-buttons__item"
          type="submit"
        >
          <span>Delete donation</span>
          <i className="bi bi-trash3-fill"></i>
        </button>
      </div>
    </form>
  );
};

export default DeleteDonationForm;
