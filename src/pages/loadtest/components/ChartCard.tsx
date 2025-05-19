import React from 'react';

interface ChartCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className }) => {
  return (
    <div className={`${className ? className : ''}`.trim()}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;
