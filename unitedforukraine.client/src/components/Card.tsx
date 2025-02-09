import { FC, ReactNode } from "react";
import Image from "./Image";
import { describe } from "node:test";

type CardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  [key: string]: any;
};

const Card: FC<CardProps> = ({
  title,
  description,
  imageSrc = "",
  imageAlt = "",
  ...rest
}) => {
  return (
    <div className="card h-100 p-4" {...rest}>
      {imageSrc !== "" && (
        <Image className={`card-img`} src={imageSrc} alt={imageAlt} />
      )}
      <div className="card-body">
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
        <h3 className="card-title">{title}</h3>
        <p className="card-text text-muted">{description}</p>
      </div>
    </div>
  );
};

export default Card;
