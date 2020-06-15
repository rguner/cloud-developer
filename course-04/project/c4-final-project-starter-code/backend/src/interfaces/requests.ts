
interface CreateTodoRequest {
    name: string;
    dueDate: string;
}

interface UpdateTodoRequest {
    name: string;
    dueDate: string;
    done: boolean;
}

export {
    CreateTodoRequest,
    UpdateTodoRequest
};
