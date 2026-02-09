import { FC, useState, MouseEvent } from "react";

interface IShareNewsUpdateButtonProps {
  relativeUrl: string;
  newsUpdateTitle: string;
  newsUpdateSummary: string;
}

const ShareNewsUpdateButton: FC<IShareNewsUpdateButtonProps> = ({
  relativeUrl,
  newsUpdateTitle,
  newsUpdateSummary,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShare = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    const locationUrl: string = `${window.location.origin}${relativeUrl}`;
    const newsUpdateInfo: string = `United For Ukraine\nRead the news update: "${newsUpdateTitle}"\nSummary: ${newsUpdateSummary}\nJoin us in making a difference!\n${locationUrl}`;

    navigator.clipboard.writeText(newsUpdateInfo).then(() => {
      console.log("URL copied to clipboard:", newsUpdateInfo);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };

  return (
    <button
      className="btn btn-sm btn-secondary btn-share"
      onClick={handleShare}
    >
      {isCopied ? (
        <i className="bi bi-file-earmark-check-fill"></i>
      ) : (
        <i className="bi bi-share"></i>
      )}
    </button>
  );
};

export default ShareNewsUpdateButton;
