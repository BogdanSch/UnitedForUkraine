import { FC, useState } from "react";

interface ShareButtonProps {
  relativeUrl: string;
  campaignTitle: string;
  campaignGoalAmount: number;
  campaignRaisedAmount: number;
}

const ShareButton: FC<ShareButtonProps> = ({
  relativeUrl,
  campaignTitle,
  campaignGoalAmount,
  campaignRaisedAmount,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShare = (): void => {
    const locationUrl: string = `${window.location.origin}${relativeUrl}`;
    const campaignInfo: string = `United For Ukraine\nSupport the campaign: "${campaignTitle}"\nRaised: ${campaignRaisedAmount} / Goal: ${campaignGoalAmount}\nJoin us in making a difference!\n${locationUrl}`;

    navigator.clipboard.writeText(campaignInfo).then(() => {
      console.log("URL copied to clipboard:", campaignInfo);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <button className="btn btn-secondary btn-share" onClick={handleShare}>
      {isCopied ? (
        <i className="bi bi-file-earmark-check-fill"></i>
      ) : (
        <i className="bi bi-share"></i>
      )}
    </button>
  );
};

export default ShareButton;
