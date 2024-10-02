type Task = {
    id: number;
    title: string;
    description: string;
    assignees: string;
    status: status;
}

type status = {
    id: number | undefined;
    name: string;
    description: string;
    customizable: boolean;
    limitEnabled: boolean;
}

type Tasks = Task[]

type Statuses = status[]