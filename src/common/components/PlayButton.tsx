import React from 'react';
import styles from './SaveButton.module.scss';
import { ScenarioInfo } from '@/pages/flow-canvas/types/index.ts';

interface PalyButtonProps {
  path: string;
  selectedScenario: ScenarioInfo | null;
  onPlay: (name: string | undefined) => void;
  loading?: boolean;
}
const disabledStyle: React.CSSProperties = {
  cursor: 'not-allowed',
  opacity: 0.6,
};

const PlayButton: React.FC<PalyButtonProps> = ({
  path,
  onPlay,
  selectedScenario,
  loading = false,
}) => {
  return (
    <button
      className={styles.container}
      disabled={loading}
      style={loading ? disabledStyle : undefined}
      onClick={() => {
        if (!selectedScenario || loading) return;
        onPlay(selectedScenario.name);
      }}
    >
      <img src={path} alt="Play Scenario" width={24} height={24} />
    </button>
  );
};

export default PlayButton;
