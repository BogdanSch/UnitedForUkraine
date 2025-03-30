import { FC, ReactNode } from "react";

type SectionHeadlineProps = {
  className?: string;
  title: string;
  headingClassName?: string;
  sectionIndicatorTitle: string;
  description?: string;
  children?: ReactNode;
};

const SectionHeadline: FC<SectionHeadlineProps> = ({
  className = "",
  title,
  headingClassName = "",
  sectionIndicatorTitle,
  description,
  children,
}) => {
  return (
    <div className={`headline ${className ?? ""}`}>
      <div className="text-group">
        <h4 className="section-indicator">{sectionIndicatorTitle}</h4>
        <h2 className={`heading ${headingClassName ?? ""}`}>{title}</h2>
        {description && <p className="headline__description">{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default SectionHeadline;
