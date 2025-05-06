import { FC, ReactNode } from "react";
import Image from "../Image";

type CardProps = {
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
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
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
