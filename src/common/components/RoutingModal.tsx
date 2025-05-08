import React from 'react';
import styles from './RoutingModal.module.scss';
import { ROUTES } from '@/config/routes.ts';
import { useNavigate } from 'react-router-dom';

const RoutingModal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {Object.values(ROUTES).map(({ path, label, icon }) => (
        <button key={path} onClick={() => navigate(path)} className={styles.button}>
          <img src={icon} alt={label} width={20} height={20} />
        </button>
      ))}
    </div>
  );
};

export default RoutingModal;
