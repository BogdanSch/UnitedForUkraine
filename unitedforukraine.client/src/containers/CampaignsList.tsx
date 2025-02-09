import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Campaign } from "../types";

import Card from "../components/Card";

type CampaignsListProps = {
  //   campaigns: Campaign[];
};

const CampaignsList: FC<CampaignsListProps> = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        method: "GET",
        url: "https://localhost:7043/api/Home/getCompaigns",
      };

      try {
        const { data } = await axios.request(options);

        console.log(data);
        setCampaigns(data?.campaigns || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul className="campaigns__list mt-5">
      {campaigns?.length ? (
        campaigns.map((campaign: Campaign) => (
          <Card
            key={campaign.id}
            title={campaign.title}
            description={campaign.description}
            imageSrc={campaign.imageUrl}
            imageAlt={campaign.title}
          />
        ))
      ) : (
        <p className="text-center">No campaigns have been found!</p>
      )}
    </ul>
  );
};

export default CampaignsList;
