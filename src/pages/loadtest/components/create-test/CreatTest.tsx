import React, { useEffect, useState } from 'react';
import { getScenarioList } from '@/pages/flow-canvas/service/scenarioService';
import { Stage } from '@/pages/loadtest/types';
import { createLoadTest } from '@/pages/loadtest/service/loadTestService';
import { CommonButton } from '@/common/components/CommonButton';
import styles from '@/pages/loadtest/styles/CreatTest.module.scss';
import { ScenarioInfo } from '@/pages/flow-canvas/types';

interface CreatTestProps {
  onClose: () => void;
  selectedScenario?: ScenarioInfo | null;
}

const CreatTest: React.FC<CreatTestProps> = ({ onClose, selectedScenario }) => {
  const [scenarioList, setScenarioList] = useState<string[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [thinkTimeMs, setThinkTimeMs] = useState(0);
  const [name, setName] = useState('');
  const [stages, setStages] = useState<Stage[]>([{ vus: 0, duration: 0 }]);
  const [randomStageCount, setRandomStageCount] = useState(1);
  const [minVus, setMinVus] = useState(1);
  const [maxVus, setMaxVus] = useState(10);
  const [minDuration, setMinDuration] = useState(10);
  const [maxDuration, setMaxDuration] = useState(60);

  const [useRandomStage, setUseRandomStage] = useState(false);
  const [randomStagesPreview, setRandomStagesPreview] = useState<Stage[]>([]);

  useEffect(() => {
    const loadScenario = async () => {
      await getScenarioList()
        .then(setScenarioList)
        .catch(err => console.error('[CreatTest] getScenarioList Error', err));
    };
    loadScenario();
  }, []);

  useEffect(() => {
    if (scenarioList.length === 0 || !selectedScenario) return;

    const targetFile = `${selectedScenario.name}.yaml`;
    if (scenarioList.includes(targetFile)) {
      setSelectedScenarios([targetFile]);
    }
  }, [scenarioList, selectedScenario]);

  const toggleScenario = (item: string) => {
    setSelectedScenarios(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item],
    );
  };

  const handleStageChange = (index: number, key: keyof Stage, value: number) => {
    const newStages = [...stages];
    newStages[index][key] = value;
    setStages(newStages);
  };
  const addStage = () => setStages(prev => [...prev, { vus: 0, duration: 0 }]);

  const submitLoadTest = async () => {
    if (!fileName || selectedScenarios.length === 0 || (!useRandomStage && stages.length === 0)) {
      alert('Please fill all required fields.');
      return;
    }

    const finalStages = useRandomStage ? randomStagesPreview : stages;

    const payload = {
      fileName,
      name,
      description,
      thinkTimeMs,
      stage: finalStages,
      scenarios: selectedScenarios,
    };

    try {
      await createLoadTest(payload);
      alert('Load Test successfully created!');
      onClose();
    } catch (error) {
      console.error('[CreatTest] submitLoadTest Error', error);
    }
  };

  const generateRandomStages = () => {
    const randomStages: Stage[] = [];
    for (let i = 0; i < randomStageCount; i++) {
      const vus = Math.floor(Math.random() * (maxVus - minVus + 1)) + minVus;
      const duration = Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration;
      randomStages.push({ vus, duration });
    }
    setRandomStagesPreview(randomStages);
  };

  return (
    <form
      className={styles.formContainer}
      onSubmit={e => {
        e.preventDefault();
        submitLoadTest();
      }}
    >
      <fieldset className={styles.fieldset}>
        <legend>Scenarios ({selectedScenarios.length} selected)</legend>
        <div className={styles.scenarioList}>
          {scenarioList.map(item => (
            <div
              key={item}
              className={`${styles.scenarioItem} ${selectedScenarios.includes(item) ? styles.selected : ''}`}
              onClick={() => toggleScenario(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Test Configuration</legend>
        <div className={styles.rangeRow}>
          <label>
            File Name
            <input
              type="text"
              value={fileName}
              onChange={e => setFileName(e.target.value)}
              required
            />
          </label>

          <label>
            Name
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </label>
        </div>

        <div className={styles.rangeRow}>
          <label>
            Description
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
          </label>

          <label>
            Think Time (ms)
            <input
              type="number"
              value={thinkTimeMs}
              onChange={e => setThinkTimeMs(Number(e.target.value))}
              min={0}
            />
          </label>
        </div>
      </fieldset>

      <fieldset className={`${styles.fieldset}`}>
        <legend>Stage Configuration</legend>

        <label style={{ flexDirection: 'row' }} className={`${styles.toggleLabel}`.trim()}>
          <span>Use Randomly Generated Stages</span>
          <input
            type="checkbox"
            checked={useRandomStage}
            onChange={() => setUseRandomStage(prev => !prev)}
            className={styles.toggleInput}
          />
          <span className={styles.slider}></span>
        </label>

        {useRandomStage ? (
          <>
            <label>
              Stage Count
              <input
                type="number"
                value={randomStageCount}
                onChange={e => setRandomStageCount(Number(e.target.value))}
                min={1}
              />
            </label>

            <div className={styles.rangeRow}>
              <label>
                VUS Min
                <input
                  type="number"
                  value={minVus}
                  onChange={e => setMinVus(Number(e.target.value))}
                />
              </label>
              <label>
                VUS Max
                <input
                  type="number"
                  value={maxVus}
                  onChange={e => setMaxVus(Number(e.target.value))}
                />
              </label>
            </div>

            <div className={styles.rangeRow}>
              <label>
                Duration Min (s)
                <input
                  type="number"
                  value={minDuration}
                  onChange={e => setMinDuration(Number(e.target.value))}
                />
              </label>
              <label>
                Duration Max (s)
                <input
                  type="number"
                  value={maxDuration}
                  onChange={e => setMaxDuration(Number(e.target.value))}
                />
              </label>
            </div>

            <button type="button" onClick={generateRandomStages} className={styles.addButton}>
              Generate Random Stages
            </button>

            {randomStagesPreview.length > 0 && (
              <div className={styles.stageSummary}>
                {randomStagesPreview.length} stage(s) generated.
              </div>
            )}
          </>
        ) : (
          <>
            {stages.map((stage, index) => (
              <div key={index} className={styles.stageRow}>
                <label>
                  VUS
                  <input
                    type="number"
                    value={stage.vus}
                    onChange={e => handleStageChange(index, 'vus', Number(e.target.value))}
                    min={0}
                  />
                </label>
                <label>
                  Duration (s)
                  <input
                    type="number"
                    value={stage.duration}
                    onChange={e => handleStageChange(index, 'duration', Number(e.target.value))}
                    min={0}
                  />
                </label>
              </div>
            ))}
            <button type="button" className={styles.addButton} onClick={addStage}>
              + Add Stage
            </button>
          </>
        )}
      </fieldset>

      <div className={styles.buttonWrapper}>
        <CommonButton onCancel={onClose} onConfirm={() => {}} />
      </div>
    </form>
  );
};

export default CreatTest;
