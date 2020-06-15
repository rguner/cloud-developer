import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import * as middy from "middy";

import {cors} from "middy/middlewares";

import {getTodo, updateTodo} from '../../businessLogic/todos';

import {UpdateTodoRequest} from '../../interfaces/requests';

import {createLogger} from '../../utils/logger';

const logger = createLogger('updateTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        logger.info("Processing event", event);
        const todoId = event.pathParameters.todoId;
        const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
        const todoItem = await getTodo(todoId, event);

        if (!todoItem) {
            const message = "Todo does not exist or you are not authorized to update the todo";
            logger.warning("updateTodo", message);
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: message
                })
            };
        }

        await updateTodo(todoId, updatedTodo, event);

        return {
            statusCode: 200,
            body: ""
        };
    } catch (error) {
        logger.error("updateTodo", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error
            })
        };
    }
});

handler.use(
    cors({
        origin: "*",
        credentials: true
    })
);
