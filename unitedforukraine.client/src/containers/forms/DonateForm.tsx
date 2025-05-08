import { FC, useState } from "react";
import { CreateDonationRequestDto } from "../../types";

interface IDonateFormProps {
  campaignId: number;
}

const DonateForm: FC<IDonateFormProps> = ({ campaignId }) => {
  // First request creation of the donation
  // Second request stipe session
  const [formData, setFormData] = useState<CreateDonationRequestDto>({
      userId: "";
        amount: 1;
        currency: ;
        paymentMethod: string;
        status: CampaignStatus;
        campaignId: number;
    });
};

export default DonateForm;
