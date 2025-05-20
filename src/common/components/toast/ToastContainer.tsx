import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@/common/types/toastTpyes';
import styles from './Toast.module.scss';

interface Props {
  toasts: Toast[];
}

const ToastContainer: React.FC<Props> = ({ toasts }) => (
  <div className={styles.container}>
    {toasts.map(t => (
      <div
        key={t.id}
        className={styles.toast}
        style={{ '--duration': t.duration } as React.CSSProperties}
      >
        {t.message}
      </div>
    ))}
  </div>
);

export default ToastContainer;
