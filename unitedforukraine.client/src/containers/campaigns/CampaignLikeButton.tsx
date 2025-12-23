import axios from "axios";
import { protectedAxios } from "../../utils/axiosInstances";
import { FC, useState } from "react";
import { ErrorAlert } from "../../components";
import { API_URL } from "../../variables";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";

interface ICampaignLikeButtonProps {
  campaignId: number;
  campaignLiked: boolean;
}

const CampaignLikeButton: FC<ICampaignLikeButtonProps> = ({
  campaignId,
  campaignLiked,
}) => {
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(campaignLiked);
  const likeOrDislikeCampaign = async () => {
    try {
      const { data } = await protectedAxios.post(
        `${API_URL}/campaigns/${campaignId}/like`
      );
      setIsLiked(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setRequestError(error.response?.data.message);
      } else {
        console.log(`Error liking campaign: ${error}`);
      }
    }
  };
  return (
    <button className="btn btn-sm btn-light" onClick={likeOrDislikeCampaign}>
      {!isNullOrWhitespace(requestError) && (
        <ErrorAlert errorMessage={requestError!} />
      )}
      {isLiked ? (
        <i className="bi bi-hearts"></i>
      ) : (
        <i className="bi bi-heart"></i>
      )}
    </button>
  );
};

export default CampaignLikeButton;
