import React from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  className?: string;
  [key: string]: any;
}

const DataCard: React.FC<DataCardProps> = ({ title, value, className }) => {
  return (
    <div className={`${className ? className : ''}`.trim()}>
      <h5>{title}</h5>
      <h2>{value}</h2>
    </div>
  );
};

export default DataCard;
