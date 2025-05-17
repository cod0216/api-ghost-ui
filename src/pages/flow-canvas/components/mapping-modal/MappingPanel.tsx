// import React from 'react';
// import styles from '@/pages/flow-canvas/styles/MappingModal.module.scss';
// import { MappingData } from '@/pages/flow-canvas/types/mapping';

// interface MappingPanelProps {
//   label: string;
//   mappingData: MappingData;
//   selectedKeys: string[];
//   onToggleKey: (key: string) => void;
//   singleSelect?: boolean;
// }

// const MappingPanel: React.FC<MappingPanelProps> = ({
//   label,
//   mappingData,
//   selectedKeys,
//   onToggleKey,
//   singleSelect = false,
// }) => (
//   <div className={styles.panel}>
//     <div className={styles.panelHeader}>
//       <h2 className={styles.label}>{label}</h2>
//       <div className={styles.pathGroup}>
//         <div className={styles.methodPathGroup}>
//           <span className={`${styles.methodButton} ${styles[`${mappingData.method}Method`]}`}>
//             {mappingData.method}
//           </span>
//           <span className={styles.pathText}>
//             {mappingData.baseURl}
//             {mappingData.path}
//           </span>
//         </div>
//       </div>
//     </div>
//     <table className={styles.table}>
//       <thead>
//         <tr>
//           <th></th>
//           <th>Key</th>
//           <th>Type</th>
//         </tr>
//       </thead>
//       <tbody>
//         {mappingData.valueList &&
//           mappingData.valueList.map(item => {
//             const { key, type } = item;
//             const disabled = false;
//             const checked = selectedKeys.includes(key);
//             return (
//               <tr key={key} className={disabled ? styles.disabledRow : ''}>
//                 <td>
//                   {singleSelect ? (
//                     <input
//                       type="radio"
//                       name={label}
//                       disabled={disabled}
//                       checked={checked}
//                       onChange={() => onToggleKey(key)}
//                     />
//                   ) : (
//                     <input
//                       type="checkbox"
//                       disabled={disabled}
//                       checked={checked}
//                       onChange={() => onToggleKey(key)}
//                     />
//                   )}
//                 </td>
//                 <td>{key}</td>
//                 <td>{type}</td>
//               </tr>
//             );
//           })}
//       </tbody>
//     </table>
//   </div>
// );

// export default MappingPanel;
