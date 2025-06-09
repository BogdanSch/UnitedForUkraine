import { FC, useEffect, useRef } from "react";

interface ImageProps {
  imageClassName?: string;
  containerClassName?: string;
  id?: string;
  src: string;
  alt: string;
  [key: string]: any;
}

const Image: FC<ImageProps> = ({
  imageClassName,
  containerClassName,
  id,
  src,
  alt,
}) => {
  const blurDivRef = useRef(null);

  useEffect(() => {
    if (!blurDivRef.current) return;

    const blurDiv: HTMLDivElement = blurDivRef.current;
    const image = blurDiv.querySelector<HTMLImageElement>(".image")!;

    function loaded() {
      blurDiv.classList.add("loaded");
    }

    if (image.complete) {
      loaded();
    } else {
      image.addEventListener("load", loaded);
    }

    return () => {
      image.removeEventListener("load", loaded);
    };
  }, [blurDivRef]);

  return (
    <div
      className={`blur-load${
        containerClassName && containerClassName !== ""
          ? ` ${containerClassName}`
          : ""
      }`}
      ref={blurDivRef}
    >
      <img
        className={`image ${imageClassName}`}
        id={id}
        src={src}
        alt={alt}
        loading="lazy"
      />
    </div>
  );
};

export default Image;
