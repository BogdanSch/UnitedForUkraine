import { FC } from "react";
import { Card, Image } from "../";
import { ImageDto } from "../../types";

interface ICarouselProps {
  images: ImageDto[];
  className?: string;
  id: string;
  [key: string]: any;
}

const Carousel: FC<ICarouselProps> = ({ images, id, className, ...rest }) => {
  return (
    <div
      id={id}
      className={`carousel slide ${className}`}
      data-bs-ride="true"
      {...rest}
    >
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={`carousel-indicator-${index}`}
            type="button"
            data-bs-target={`#${id}`}
            data-bs-slide-to={index.toString()}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : "false"}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((image, index) => (
          <div
            key={`carousel-item-${index}`}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <Image
              src={image.path}
              alt={image.alt}
              className="d-block w-100 carousel-image"
            />
            {image.title && image.description && (
              <Card
                className="carousel-caption d-block card--dark-transparent"
                isLite={true}
              >
                <h5>{image.title}</h5>
                <p>{image.description}</p>
              </Card>
            )}
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
