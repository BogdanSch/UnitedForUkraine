import axios from "axios";
import { FC, useContext, useEffect, useState } from "react";
import AuthContext from "../../contexts/AuthContext";
import { CampaignDto } from "../../types";
import { CampaignItem } from "../../components";
import { API_URL } from "../../variables";

const UserSupportedCampaignsList: FC = () => {
  const { user, authToken } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState<CampaignDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: `${API_URL}/donations/supportedCampaigns/${user?.id}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);

        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <>
      <ul className="campaigns__list mt-5">
        {campaigns.length > 0 ? (
          campaigns.map((campaign: CampaignDto) => (
            <CampaignItem campaign={campaign} key={campaign.title} />
          ))
        ) : (
          <p className="text-center">No campaigns have been found!</p>
        )}
      </ul>
    </>
  );
};

export default UserSupportedCampaignsList;
