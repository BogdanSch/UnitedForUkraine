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
  const percentage: number = (currentAmount / requiredAmount) * 100;

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
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
};

export default ProgressBar;
