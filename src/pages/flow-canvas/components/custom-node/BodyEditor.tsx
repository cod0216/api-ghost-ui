import React, { MouseEvent, useState } from 'react';
import styles from '@/pages/flow-canvas/styles/BodyEditor.module.scss';
import { useBodyEditorController } from '@/pages/flow-canvas/hooks/useBodyEditorController.ts';
import { BODY_EDITOR_TABS, Path } from '@/pages/flow-canvas/types/index';
import { Field } from '@/pages/flow-canvas/types/index.ts';
import { useBodyEditor } from '@/pages/flow-canvas/hooks/useBodyEditor.ts';

export interface BodyEditorProps {
  requestSchema: Field[];
  responseSchema: Field[];
  onSaveRequestSchema: (newSchema: Field[]) => void;
  onSaveResponseSchema: (newSchema: Field[]) => void;
  onClose: () => void;
}

const numericTypes = new Set([
  'int',
  'Integer',
  'long',
  'Long',
  'short',
  'Short',
  'double',
  'Double',
  'float',
  'Float',
  'byte',
  'Byte',
]);
const booleanTypes = new Set(['boolean', 'Boolean']);
/**
 * BodyEditor component
 * Uses a controller and hook to manage its tab state.
 */
const BodyEditor: React.FC<BodyEditorProps> = ({
  requestSchema,
  responseSchema,
  onSaveRequestSchema,
  onSaveResponseSchema,
  onClose,
}) => {
  const { mainTab, subTab, availableSubTabs, selectMainTab, selectSubTab } =
    useBodyEditorController(BODY_EDITOR_TABS);

  const { currentSchema: reqSchema, updateSchema: setReqSchema } = useBodyEditor(requestSchema);
  const { currentSchema: resSchema, updateSchema: setResSchema } = useBodyEditor(responseSchema);

  const [editingPath, setEditingPath] = useState<Path | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const isRequestTab = mainTab.label === BODY_EDITOR_TABS[0].mainTab.label;

  const handleSave = () => {
    if (isRequestTab) onSaveRequestSchema(reqSchema);
    else {
      onSaveResponseSchema(resSchema);
    }
    onClose();
  };

  const startEdit = (path: Path, rawValue: string) => {
    setEditingPath(path);
    setEditingValue(rawValue);
  };

  const finishEdit = (path: Path) => {
    if (!editingPath) return;
    const updated = [...(isRequestTab ? reqSchema : resSchema)];
    let cursor: any = updated;
    for (let i = 0; i < path.length - 1; i++) {
      cursor = cursor[path[i]].nestedFields!;
    }
    const idx = path[path.length - 1];
    const field = cursor[idx] as Field;
    let newVal: string | number | boolean;
    const typeName = field.type;
    // Empty input handling
    if (editingValue.trim() === '') {
      if (numericTypes.has(typeName)) newVal = 0;
      else if (booleanTypes.has(typeName)) newVal = false;
      else newVal = '';
    }
    // Numeric input
    else if (!isNaN(Number(editingValue))) {
      newVal = Number(editingValue);
    }
    // Boolean input
    else if (editingValue === 'true' || editingValue === 'false') {
      newVal = editingValue === 'true';
    }
    // String or other
    else {
      newVal = editingValue;
    }

    field.value = newVal;
    if (isRequestTab) setReqSchema(updated);
    else setResSchema(updated);
    setEditingPath(null);
  };

  const renderJsonSchema = (
    fields: Field[],
    indent: number = 0,
    parentPath: Path = [],
  ): React.ReactNode => {
    const pad = ' '.repeat(indent);
    return (
      <>
        <span>
          {pad}
          {'{'}
        </span>
        {'\n'}
        {fields.map((f, idx) => {
          const path: Path = [...parentPath, idx];
          const childPad = ' '.repeat(indent + 2);

          const isEditing =
            editingPath &&
            editingPath.length === path.length &&
            editingPath.every((n, i) => n === path[i]);
          const keyNode = <span className={styles.fieldKey}>{`"${f.name}"`}</span>;

          const colon = <span>{': '}</span>;
          const comma = <span>{','}</span>;

          let valueNode: React.ReactNode;
          if (f.nestedFields && f.nestedFields.length > 0) {
            valueNode = (
              <>
                <span>
                  {childPad}
                  {'{'}
                </span>

                {'\n'}
                {renderJsonSchema(f.nestedFields, indent + 4, path)}
                <span>
                  {childPad}
                  {'}'}
                </span>
              </>
            );
          } else {
            const raw = f.value != null ? String(f.value) : 'empty';
            if (isEditing) {
              valueNode = (
                <input
                  className={styles.editInput}
                  value={editingValue}
                  autoFocus
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => finishEdit(path)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') finishEdit(path);
                  }}
                />
              );
            } else {
              const display =
                typeof f.value === 'number' || typeof f.value === 'boolean' ? raw : `"${raw}"`;
              valueNode = (
                <span className={styles.fieldValue} onDoubleClick={() => startEdit(path, raw)}>
                  {display}
                </span>
              );
            }
          }

          return (
            <span key={idx}>
              {childPad}
              {keyNode}
              {colon}
              {valueNode}
              {comma}
              {'\n'}
            </span>
          );
        })}
        <span>
          {pad}
          {'}'}
        </span>
        {'\n'}
      </>
    );
  };

  const updateSchema = isRequestTab ? setReqSchema : setResSchema;

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  const schemaToRender = isRequestTab ? reqSchema : resSchema;

  return (
    <div className={styles.editorPopover} onClick={stopPropagation}>
      <nav className={styles.mainTabs}>
        {BODY_EDITOR_TABS.map(group => (
          <button
            key={group.mainTab.label}
            className={`${styles.tab} ${
              mainTab.label === group.mainTab.label ? styles.activeMainTab : ''
            }`}
            onClick={() => selectMainTab(group.mainTab)}
          >
            {group.mainTab.label}
          </button>
        ))}
      </nav>

      <nav className={styles.subTabs}>
        {availableSubTabs.map(tab => (
          <button
            key={tab.label}
            className={`${styles.tab} ${subTab.label === tab.label ? styles.activeSubTab : ''}`}
            onClick={() => selectSubTab(tab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className={styles.contentArea}>
        {subTab.showSchema && (
          <pre className={styles.schemaContent}>
            <code>{renderJsonSchema(schemaToRender)}</code>
          </pre>
        )}
      </section>

      <footer className={styles.buttonRow}>
        {
          <button className={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        }
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </footer>
    </div>
  );
};

export default BodyEditor;
