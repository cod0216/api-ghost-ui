import React from 'react';
import styles from './LightIndicator.module.scss';

interface LightIndicatorProps {
  isSuccess: boolean;
  size?: number;
  colorSuccess?: string;
  colorFailure?: string;
}

const LightIndicator: React.FC<LightIndicatorProps> = ({
  isSuccess,
  size = 8,
  colorSuccess = '#4CAF50',
  colorFailure = '#F44336',
}) => {
  const circleRadius = size / 2;

  const indicatorClass = isSuccess ? styles.success : styles.failure;

  return (
    <svg
      className={`${styles.indicator} ${indicatorClass}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r={circleRadius} fill={isSuccess ? colorSuccess : colorFailure} />
    </svg>
  );
};

export default LightIndicator;
