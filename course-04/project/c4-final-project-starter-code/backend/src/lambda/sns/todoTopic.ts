
import { SNSEvent, SNSHandler, S3Event } from 'aws-lambda';
import "source-map-support/register";
import { createLogger } from '../../utils/logger';
import { getTodoItem, updateAttachmentUrl } from '../../businessLogic/todos';
import { S3Helper } from '../../utils/s3Helper';

const logger = createLogger('todoTopic');

export const handler: SNSHandler = async (event: SNSEvent) => {
    logger.info("Processing SNS event", event);

    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message;
        logger.info("Processing S3 event", s3EventStr);
        const s3Event: S3Event = JSON.parse(s3EventStr);

        for (const record of s3Event.Records) {
            try {
                const todoId = record.s3.object.key;
                const todoItem = await getTodoItem(todoId);

                if (!todoItem) {
                    logger.error("Todo does not exist", todoId);
                    continue;
                }

                await updateAttachmentUrl(todoItem.todoId, todoItem.userId, S3Helper.getAttachmentUrl(todoId));
            } catch (error) {
                logger.error("Processing event record", error);
            }
        }
    }
};
