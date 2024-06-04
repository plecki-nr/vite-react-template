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

export interface DragDropStart {
    draggableId: string
    mode: string
    source: {
        droppableId: string, index: number
        type: string
    }
}