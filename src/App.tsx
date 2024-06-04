import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DroppableStateSnapshot,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";
import "./App.css";
import Droppable from "./Droppable";
import useApi from "./useApi";
import Form, { FormValues } from "./Form";

enum Status {
  OUT_OF_SERVICE = "Out of service",
  LOADING = "Loading",
  TO_JOB = "To job",
  AT_JOB = "At job",
  RETURNING = "Returning",
}

interface Truck {
  id: string;
  code: string;
  description: string;
  name: string;
  status: keyof typeof Status;
}

const reorder = (
  list: Truck[],
  startIndex: number,
  endIndex: number
): Truck[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: Truck[],
  destination: Truck[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: Truck[] } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

const App: React.FC = () => {
  const [state, setState] = useState<Truck[][]>([[], [], [], [], []]);
  const [movedTruckStatus, setMovedTruckStatus] =
    useState<keyof typeof Status>();
  const { get, add, remove, isLoading, error, shouldGet, data } =
    useApi<Truck[]>();
  console.log("zzzzff", movedTruckStatus);

  useEffect(() => {
    get("trucks");
  }, []);

  // TODO uncomment when api fixed
  // useEffect(() => {
  //   if (shouldGet) {
  //     const refetch = async () => {
  //       const updatedTrucks = await get("trucks");

  //       if (updatedTrucks) {
  //         setState(updatedTrucks);
  //       }
  //     };

  //     refetch();
  //   }
  // }, [shouldGet]);

  useEffect(() => {
    if (data) {
      const sortedTrucks = data.reduce<Truck[][]>(
        (acc, truck) => {
          switch (truck.status) {
            case "OUT_OF_SERVICE":
              acc[0].push(truck);
              return acc;

            case "LOADING":
              acc[1].push(truck);
              return acc;
            case "TO_JOB":
              acc[2].push(truck);
              return acc;

            case "AT_JOB":
              acc[3].push(truck);
              return acc;

            case "RETURNING":
              acc[4].push(truck);
              return acc;
          }
        },
        [[], [], [], [], []]
      );

      setState(sortedTrucks);
    }
  }, [data]);

  const onDragStart = (data: DropResult) => {
    const startColumnIndex = data.source.droppableId;
    const movedStatus = Object.keys(Status)[
      parseInt(startColumnIndex)
    ] as Status;

    movedStatus && setMovedTruckStatus(movedStatus);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      const columnindex = state[source.droppableId];
      const movedItem = columnindex[source.index];
      const newType = ""; //TODO

      // update('trucks',draggableId, newType);  //TODO

      setState(newState);
    }
  };

  const createTruck = (values: FormValues) => {
    const id = Date.now().toString();
    const data = {
      id,
      code: id,
      name: values.name,
      status: "OUT_OF_SERVICE",
      description: values.description,
    };

    add("trucks", data);
  };

  const enabledColumns = () => {
    if (movedTruckStatus === "OUT_OF_SERVICE") return [1, 2, 3, 4];
    if (movedTruckStatus === "RETURNING") return [0, 1];

    const statuses = Object.keys(Status);
    const currentColumnIndex =
      (movedTruckStatus && statuses.indexOf(movedTruckStatus)) || 0;

    return [0, currentColumnIndex + 1];
  };

  return (
    <div>
      <button
        onClick={() => {
          const [firstColumnValues, ...rest] = state;
          const updatedFirstColumnValues = [...firstColumnValues];

          setState([updatedFirstColumnValues, ...rest]);
        }}
      >
        Add new item
      </button>
      <Form onSubmit={createTruck} />

      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
          {state.map((el, ind) => (
            <Droppable
              key={ind}
              droppableId={`${ind}`}
              isDropDisabled={!enabledColumns().includes(ind)}
            >
              {(
                provided: DroppableProvided,
                snapshot: DroppableStateSnapshot
              ) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.code}
                      draggableId={item.code}
                      index={index}
                    >
                      {(
                        provided: DraggableProvided,
                        snapshot: DraggableStateSnapshot
                      ) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {item.name}
                            {item.status}
                            <button
                              onClick={() => {
                                const newState = [...state];
                                newState[ind].splice(index, 1);
                                setState(newState);

                                remove("trucks", item.id);
                              }}
                            >
                              delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
