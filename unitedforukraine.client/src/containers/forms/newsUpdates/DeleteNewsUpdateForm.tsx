import { FC, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { protectedAxios } from "../../../utils/axiosInstances";
import { API_URL } from "../../../variables";
import { DeleteButton } from "../../../components";

interface IDeleteNewsUpdateFormProps {
  id: number;
}

const DeleteNewsUpdateForm: FC<IDeleteNewsUpdateFormProps> = ({ id }) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      await protectedAxios.delete(`${API_URL}/newsUpdates/${id}`);
      navigate(`/newsUpdates`, {
        state: {
          message: "News update was successfully deleted.",
        },
      });
    } catch (error) {
      console.log(`Error deleting the news update: ${error}`);
      navigate(`/newsUpdates/detail/${id}`, {
        state: {
          message:
            "Error, we couldn't delete the News update. Please try again, later!",
        },
      });
    }
  };
  return (
    <form className="campaigns-detail__delete-form" onSubmit={handleSubmit}>
      <div className="form-buttons">
        <DeleteButton text="Delete news update" />
      </div>
    </form>
  );
};

export default DeleteNewsUpdateForm;
