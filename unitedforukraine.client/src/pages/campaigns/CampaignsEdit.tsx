import { FC } from "react";
import { useParams } from "react-router-dom";

const CampaignsEdit: FC = () => {
  let { id } = useParams();
  return <div>{id}</div>;
};

export default CampaignsEdit;
