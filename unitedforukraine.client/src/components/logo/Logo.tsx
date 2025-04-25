import { FC } from "react";

const Logo: FC = () => {
  return (
    <div className="site-logo">
      <svg className="site-logo__svg">
        <use href={`#logo`}></use>
      </svg>
      <span className="site-logo__text">United For Ukraine</span>
    </div>
  );
};

export default Logo;
