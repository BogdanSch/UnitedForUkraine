import axios from "axios";
import { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../variables";

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
      await axios.delete(`${API_URL}/campaigns/${id}`);
      navigate(`/campaigns`);
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button className="btn btn-outline-danger" type="submit">
        Delete Campaign
      </button>
    </form>
  );
};

export default DeleteCampaignForm;
