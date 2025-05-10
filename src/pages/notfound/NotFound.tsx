import React from 'react';
import styles from './NotFound.module.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Oops!</h1>
        <p className={styles.subtitle}>Page not found.</p>
        <p className={styles.description}>
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <button className={styles.homeButton} onClick={() => navigate('/apighost-ui')}>
          Go to MainPage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
