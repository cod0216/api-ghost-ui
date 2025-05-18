import React from 'react';
import styles from './SaveButton.module.scss';
import playIcon from '@/assets/icons/play.svg';
import { ScenarioInfo } from '@/pages/flow-canvas/types/index.ts';

interface PalyButtonProps {
  selectedScenario: ScenarioInfo | null;
  onPlay: (name: string | undefined) => void;
}

const PlayButton: React.FC<PalyButtonProps> = ({ onPlay, selectedScenario }) => {
  return (
    <button
      className={styles.container}
      onClick={() => {
        if (!selectedScenario) return;
        onPlay(selectedScenario.name);
      }}
    >
      <img src={playIcon} alt="Play Scenario" width={24} height={24} />
    </button>
  );
};

export default PlayButton;
