import { FC } from "react";

const Logo: FC = () => {
  return (
    <div className="site-logo">
      <svg className="site-logo__svg">
        <use href={`#logo`}></use>
      </svg>
      United For Ukraine
    </div>
  );
};

export default Logo;
