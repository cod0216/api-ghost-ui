import React, { useEffect, useState } from 'react';
import styles from './RoutingModal.module.scss';
import { ROUTES } from '@/config/routes.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScenario } from '@/pages/flow-canvas/hooks/useScenario';
import { useAppSelector } from '@/store/hooks';

const RoutingModal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { autoSave, autoLoad } = useScenario();
  const selected = useAppSelector(state => state.scenario.selected);
  const [top, setTop] = useState('50%');

  const isOnCanvas = (path: string) => path.includes(ROUTES.FLOW_CANVAS.path);

  const handleClick = async (path: string) => {
    if (isOnCanvas(location.pathname) && selected) {
      await autoSave(selected);
    }

    if (!isOnCanvas(location.pathname) && isOnCanvas(path) && selected) {
      await autoLoad(selected.name + '.yaml');
    }

    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = Math.min(scrollY / 2, 200);
      setTop(`calc(50% - ${offset}px)`);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.navWrapper} style={{ top }}>
      <div className={styles.container}>
        {Object.values(ROUTES).map(({ path, label, icon }) => (
          <button key={path} onClick={() => handleClick(path)} className={styles.button}>
            <img src={icon} alt={label} width={20} height={20} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoutingModal;
