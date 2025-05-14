import { EdgeProps, getSmoothStepPath } from 'reactflow';
import EdgeLabelEditor from './EdgeLabelEditor';

type CustomEdgeProps = EdgeProps & {
  onChangeLabel?: (edgeId: string, newLabel: string) => void;
};

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  onChangeLabel,
}) => {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const handleLabelChange = (newLabel: string) => {
    if (onChangeLabel) {
      onChangeLabel(id, newLabel);
    }
  };

  return (
    <>
      <path id={id} d={path} stroke="#222" strokeWidth={1.5} fill="none" markerEnd={markerEnd} />
      {data?.expected?.status !== undefined && (
        <foreignObject
          width={150}
          height={40}
          x={(sourceX + targetX) / 2 - 75}
          y={(sourceY + targetY) / 2 - 20}
        >
          <EdgeLabelEditor
            edgeId={id}
            initialLabel={data.expected.status}
            onChangeLabel={handleLabelChange}
          />
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge;
