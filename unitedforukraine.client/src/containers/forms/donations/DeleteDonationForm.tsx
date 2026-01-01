import { protectedAxios } from "../../../utils/axiosInstances";
import { Dispatch, FC, FormEvent, SetStateAction } from "react";
import { API_URL } from "../../../variables";
import { PaginatedDonationsDto } from "../../../types";

interface IDeleteDonationFormProps {
  id: number;
  setPaginatedDonations: Dispatch<SetStateAction<PaginatedDonationsDto>>;
  setMessage: Dispatch<SetStateAction<string>>;
}
const DeleteDonationForm: FC<IDeleteDonationFormProps> = ({
  id,
  setPaginatedDonations,
  setMessage,
}) => {
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      await protectedAxios.delete(`${API_URL}/donations/${id}`);
      setPaginatedDonations((prev) => {
        const filteredDonations = prev.donations.filter(
          (donation) => donation.id !== id
        );
        return {
          donations: filteredDonations,
          hasNextPage: prev.hasNextPage,
        };
      });
      setMessage("Donation was successfully deleted.");
    } catch (error) {
      console.error(`Error deleting the donation: ${error}`);
      setMessage("We couldn't delete the donation. Please, try again later!");
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
