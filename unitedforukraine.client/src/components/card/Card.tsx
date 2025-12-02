import { FC, ReactNode } from "react";
import Image from "../Image";

type CardProps = {
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  cardStatus?: string;
  isLite: boolean;
  children: ReactNode;
  [key: string]: any;
};

const Card: FC<CardProps> = ({
  className = "",
  imageSrc = "",
  imageAlt = "",
  cardStatus = "",
  isLite,
  children,
  ...rest
}) => {
  return (
    <div
      className={`card px-4 py-4 ${className}${isLite ? " card--lite" : ""}`}
      {...rest}
    >
      <div className="card-image">
        {cardStatus !== "" && <div className="card-status">{cardStatus}</div>}
        {!isLite && imageSrc.trim() !== "" && (
          <Image imageClassName={`card-img`} src={imageSrc} alt={imageAlt} />
        )}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
