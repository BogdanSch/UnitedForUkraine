import { FC, useState } from "react";

interface ShareButtonProps {
  targetUrl: string;
}

const ShareButton: FC<ShareButtonProps> = ({ targetUrl }) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShare = (): void => {
    const locationUrl: string = `${window.location.origin}${targetUrl}`;

    navigator.clipboard.writeText(locationUrl).then(() => {
      console.log("URL copied to clipboard:", locationUrl);
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
