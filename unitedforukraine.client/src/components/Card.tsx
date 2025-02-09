import { FC, ReactNode } from "react";
import Image from "./Image";

type CardProps = {
  className?: string;
  imageSrc: string;
  imageAlt: string;
  cardStatus?: string;
  children: ReactNode;
  [key: string]: any;
};

const Card: FC<CardProps> = ({
  className = "",
  imageSrc = "",
  imageAlt = "",
  cardStatus = "",
  children,
  ...rest
}) => {
  return (
    <div className={`card p-4 ${className}`} {...rest}>
      <div className="card-image">
        {cardStatus !== "" && <div className={`card-status`}>{cardStatus}</div>}
        {imageSrc !== "" && (
          <Image className={`card-img`} src={imageSrc} alt={imageAlt} />
        )}
      </div>
      <div className="card-body">
        {children}
        {/* <div className="icon-wrapper bg-soft-primary">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            className="text-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div> */}
      </div>
    </div>
  );
};

export default Card;
