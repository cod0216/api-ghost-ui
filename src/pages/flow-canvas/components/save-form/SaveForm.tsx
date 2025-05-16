import React, { useState, useEffect } from 'react';
import styles from './SaveForm.module.scss';
import { useAppSelector } from '@/store/hooks';
import { ScenarioInfo } from '@/pages/flow-canvas/types';
import { useScenario } from '@/pages/flow-canvas/hooks/useScenario';
import { CommonButton } from '@/common/components/CommonButton';
import saveIcon from '@/assets/icons/save.svg';

const SaveForm: React.FC = () => {
  const selected = useAppSelector(state => state.scenario.selected) as ScenarioInfo | null;
  const { exportInline } = useScenario();

  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [timeoutMs, setTimeoutMs] = useState(1000);

  // Populate fields when expanded
  useEffect(() => {
    if (expanded) {
      setName(selected?.name ?? '');
      setDescription(selected?.description ?? '');
      setTimeoutMs(selected?.timeoutMs ?? 1000);
    }
  }, [expanded, selected]);

  const onConfirm = async () => {
    if (name.length > 250) {
      alert('Scenario Name must be at most 250 characters.');
      return;
    }
    if (description.length > 255) {
      alert('Description must be at most 255 characters.');
      return;
    }
    await exportInline(name.trim(), description.trim(), timeoutMs);
    setExpanded(false);
  };
  const onCancel = () => setExpanded(false);

  return (
    <>
      <button className={styles.toggleButton} onClick={() => setExpanded(prev => !prev)}>
        <img src={saveIcon} alt="Save" width={24} height={24} />
      </button>

      {expanded && (
        <div className={styles.formContainer}>
          <div className={styles.field}>
            <label>Scenario Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={250}
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={255}
            />
          </div>
          <div className={styles.field}>
            <label>Timeout (ms)</label>
            <input
              type="number"
              value={timeoutMs}
              onChange={e => setTimeoutMs(Number(e.target.value))}
              min={0}
              className={styles.noSpinner}
            />
          </div>
          <div className={styles.actions}>
            <CommonButton onConfirm={onConfirm} onCancel={onCancel} />
          </div>
        </div>
      )}
    </>
  );
};

export default SaveForm;
