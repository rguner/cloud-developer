import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'

import * as middy from "middy";
import {cors} from "middy/middlewares";

import {getAllTodosByUser} from '../../businessLogic/todos';

import {createLogger} from '../../utils/logger'

const logger = createLogger('getTodos')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        logger.info("Processing event", event);
        const todos = await getAllTodosByUser(event);

        return {
            statusCode: 200,
            body: JSON.stringify({
                items: todos
            })
        };
    } catch (error) {
        logger.error("getTodos", error);
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
        origin: "*"
    })
);
