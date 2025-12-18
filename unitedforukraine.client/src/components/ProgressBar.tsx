import { FC } from "react";

type ProgressBarProps = {
  className?: string;
  currentAmount: number;
  requiredAmount: number;
};

const ProgressBar: FC<ProgressBarProps> = ({
  className = "",
  currentAmount,
  requiredAmount,
}) => {
  let percentage: number = (currentAmount / requiredAmount) * 100;
  if (percentage > 100) percentage = 100;

  return (
    <div className={`progress ${className}`}>
      <div
        className="progress-bar"
        role="progressbar"
        style={{
          width: `${percentage}%`,
        }}
        aria-valuenow={currentAmount}
        aria-valuemin={0}
        aria-valuemax={requiredAmount}
      >
        {percentage > 8 ? `${percentage.toFixed(0)}%` : ""}
      </div>
    </div>
  );
};

export default ProgressBar;
