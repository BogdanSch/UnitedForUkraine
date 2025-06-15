import { FC, ReactNode } from "react";

type SectionHeadlineProps = {
  className?: string;
  title: string;
  headingClassName?: string;
  sectionIndicatorTitle: string;
  description?: ReactNode | string;
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
        {sectionIndicatorTitle.trim() !== "" && (
          <h4 className="section-indicator">{sectionIndicatorTitle}</h4>
        )}
        {title.trim() !== "" && (
          <h2 className={`heading ${headingClassName ?? ""}`}>{title}</h2>
        )}
        {description != null && (
          <p className="headline__description">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default SectionHeadline;
