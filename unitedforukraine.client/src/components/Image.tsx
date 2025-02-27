import { FC, useEffect, useRef } from "react";

interface ImageProps {
  className?: string;
  id?: string;
  src: string;
  alt: string;
  [key: string]: any;
}

const Image: FC<ImageProps> = ({ className, id, src, alt }) => {
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
    <div className={`blur-load ${className}__container`} ref={blurDivRef}>
      <img
        className={`image ${className}`}
        id={id}
        src={src}
        alt={alt}
        loading="lazy"
      />
    </div>
  );
};

export default Image;
