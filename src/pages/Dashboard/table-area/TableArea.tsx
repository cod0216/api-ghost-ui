import styles from './TableArea.module.scss';

interface TableAreaProps {}

const TableArea: React.FC<TableAreaProps> = () => {
  return (
    <div className={styles.tableArea}>
      <h4> Data </h4>
      <div className={styles.tableDataArea}></div>
    </div>
  );
};

export default TableArea;
