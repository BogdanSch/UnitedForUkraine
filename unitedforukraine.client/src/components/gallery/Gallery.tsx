import { FC } from "react";
import { Image } from "../";
import { ImageDto } from "../../types";

interface IGalleryProps {
  images: ImageDto[];
  className?: string;
  id: string;
  [key: string]: any;
}

const Gallery: FC<IGalleryProps> = ({
  images,
  id,
  className = "",
  ...rest
}) => {
  if (!images || images.length < 2) return null;

  const imagePairs: ImageDto[][] = [];
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push(images.slice(i, i + 2));
  }

  return (
    <div className={`row ${className}`} id={id} {...rest}>
      {imagePairs.map((pair, index) => (
        <div
          key={index}
          className={`col-lg-6 col-md-12 mb-4 mb-lg-0 ${
            index > 0 ? `mt-${index + 2}` : ""
          }`}
        >
          {pair.map((image, subIndex) => (
            <Image
              key={subIndex}
              image={image}
              containerClassName={`${className}__container`}
              imageClassName={`w-100 shadow-1-strong mb-4 ${className}__image`}
              alt={image.alt}
              src={image.path}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
