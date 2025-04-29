import styles from './StepList.module.scss';

const StepList: React.FC = () => {
  const steps = [
    { id: 1, method: 'POST', endpoint: '/api/auth/login', status: 'OK' },
    { id: 2, method: 'GET', endpoint: '/api/posts', status: 'OK' },
    { id: 3, method: 'POST', endpoint: '/api/posts', status: 'CREATED' },
    { id: 4, method: 'GET', endpoint: '/api/posts/11', status: 'UNAUTHORIZED' },
    { id: 5, method: 'POST', endpoint: '/api/auth/refresh', status: 'OK' },
  ];

  return (
    <div className={styles.stepList}>
      {steps.map(step => (
        <div key={step.id} className={styles.stepItem}>
          <div className={styles.method}>{step.method}</div>
          <div className={styles.endpoint}>{step.endpoint}</div>
          <div className={styles.status}>{step.status}</div>
        </div>
      ))}
    </div>
  );
};

export default StepList;
