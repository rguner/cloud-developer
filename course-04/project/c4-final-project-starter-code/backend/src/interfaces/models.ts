interface TodoItem {
    userId: string;
    todoId: string;
    createdAt: string;
    name: string;
    dueDate: string;
    done: boolean;
    attachmentUrl?: string;
};

interface TodoUpdate {
    name: string;
    dueDate: string;
    done: boolean;
};

export {
    TodoItem,
    TodoUpdate
};
