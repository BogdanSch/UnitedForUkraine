import { protectedAxios } from "../../../utils/axiosInstances";
import { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../variables";

interface IDeleteCampaignFormProps {
  id: number;
}
const DeleteCampaignForm: FC<IDeleteCampaignFormProps> = ({ id }) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      await protectedAxios.delete(`${API_URL}/campaigns/${id}`);
      navigate(`/campaigns`, {
        state: {
          message: "Campaign was successfully deleted.",
        },
      });
    } catch (error) {
      console.error(`Error deleting campaign: ${error}`);
    }
  };

  return (
    <form className="campaigns-detail__delete-form" onSubmit={handleSubmit}>
      <div className="form-buttons">
        <button
          className="btn btn-outline-danger form-buttons__item"
          type="submit"
        >
          <span>Delete Campaign</span>
          <i className="bi bi-trash3-fill"></i>
        </button>
      </div>
    </form>
  );
};

export default DeleteCampaignForm;
