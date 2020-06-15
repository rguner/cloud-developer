import * as uuid from "uuid";
import {CreateTodoRequest, UpdateTodoRequest} from "../interfaces/requests";
import {TodoItem, TodoUpdate} from "../interfaces/models";
import {TodoAccess} from "../dataLayer/todoAccess";
import {APIGatewayProxyEvent} from "aws-lambda";
import {AuthHelper} from "../utils/authHelper";
import {S3Helper} from "../utils/s3Helper";

const todoAccess = new TodoAccess();
const s3Helper = new S3Helper();

export const createTodo = async (request: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> => {
    const todoId = uuid.v4();
    const userId = AuthHelper.getUserId(event);

    return await todoAccess.createTodo({
        createdAt: new Date().toISOString(),
        done: false,
        dueDate: request.dueDate,
        name: request.name,
        todoId,
        userId,
        attachmentUrl: ""
    });
};

export const getAllTodosByUser = async (event: APIGatewayProxyEvent): Promise<TodoItem[]> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.getAllTodosByUser(userId);
};

export const getTodo = async (todoId: string, event: APIGatewayProxyEvent): Promise<TodoItem> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.getTodo(todoId, userId);
};

export const deleteTodo = async (todoId: string, event: APIGatewayProxyEvent): Promise<void> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.deleteTodo(todoId, userId);
};

export const updateTodo = async (todoId: string, request: UpdateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoUpdate> => {
    const userId = AuthHelper.getUserId(event);
    return await todoAccess.updateTodo(todoId, userId, request);
};

export const getUploadUrl = (todoId: string) => s3Helper.getUploadUrl(todoId);

export const deleteS3BucketObject = (todoId: string) => s3Helper.deleteObject(todoId);

export const getTodoItem = async (todoId: string): Promise<TodoItem> => {
    return await todoAccess.getTodoItem(todoId);
};

export const updateAttachmentUrl = async (todoId: string, userId: string, attachmentUrl: string): Promise<void> => {
    return await todoAccess.updateAttachmentUrl(todoId, userId, attachmentUrl);
};

