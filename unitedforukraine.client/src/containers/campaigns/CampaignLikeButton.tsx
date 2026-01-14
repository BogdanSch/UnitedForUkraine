import axios from "axios";
import { protectedAxios } from "../../utils/axiosInstances";
import { FC, useState } from "react";
import { ErrorAlert } from "../../components";
import { API_URL } from "../../variables";
import { isNullOrWhitespace } from "../../utils/helpers/stringHelper";
import { CampaignDto } from "../../types";

interface ICampaignLikeButtonProps {
  campaign: CampaignDto;
  handleDislike?: () => void;
}

const CampaignLikeButton: FC<ICampaignLikeButtonProps> = ({
  campaign,
  handleDislike,
}) => {
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(campaign.isLiked);
  const likeOrDislikeCampaign = async () => {
    try {
      const { data } = await protectedAxios.post(
        `${API_URL}/campaigns/${campaign.id}/like`
      );
      setIsLiked(data);
      campaign.isLiked = data;
      if (!data && handleDislike) handleDislike();
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
