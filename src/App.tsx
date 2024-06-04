import React, { useState, useEffect } from "react";
import "./App.css";
import useApi from "./useApi";
import Form, { FormValues } from "./Form";
import DragDrop from "./DragDrop";

export enum Status {
  OUT_OF_SERVICE = "Out of service",
  LOADING = "Loading",
  TO_JOB = "To job",
  AT_JOB = "At job",
  RETURNING = "Returning",
}

export interface Truck {
  id: string;
  code: string;
  description: string;
  name: string;
  status: keyof typeof Status;
}

const App: React.FC = () => {
  const [state, setState] = useState<Truck[][]>([[], [], [], [], []]);

  const { get, add, remove, isLoading, error, shouldGet, data } =
    useApi<Truck[]>();

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

  return (
    <div>
      <Form onSubmit={createTruck} />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {Object.values(Status).map((status) => (
          <p style={{ margin: "0px" }}>{status}</p>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <DragDrop
          state={state}
          setState={setState}
          renderContent={(item, columnIndex, itemIndex) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              name: {item.name}
              <br />
              status: {item.status}
              <br />
              description: {item.description}
              <button
                onClick={() => {
                  const newState = [...state];
                  newState[columnIndex].splice(itemIndex, 1);
                  setState(newState);

                  remove("trucks", item.id);
                }}
              >
                delete
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default App;
