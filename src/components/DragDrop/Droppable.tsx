import { useEffect, useState } from "react";
import { Droppable as DndDroppable, DroppableProps } from "react-beautiful-dnd";

const Droppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <DndDroppable {...props}>{children}</DndDroppable>;
};

export default Droppable;
