import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import {CreateTodoRequest} from '../../interfaces/requests'

import {createLogger} from '../../utils/logger';

import * as middy from "middy";
import {cors} from "middy/middlewares";
import {createTodo} from "../../businessLogic/Todos";

const logger = createLogger('createTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('Processing event:', event);

        const newTodo: CreateTodoRequest = JSON.parse(event.body);
        const newItem = await createTodo(newTodo, event);

        return {
            statusCode: 201,
            body: JSON.stringify({
                item: newItem
            })
        };
    } catch (error) {
        logger.error("createTodo", error);
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



