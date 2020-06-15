import {config} from "../common/config";
import * as AWS from "aws-sdk";

const AWSXray = require('aws-xray-sdk');
const XAWS = AWSXray.captureAWS(AWS);

export class S3Helper {
    constructor(
        private readonly s3: AWS.S3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly urlExpiration = parseInt(config.signedUrlExpiration, 10)) {
    }

    getUploadUrl(todoId: string): string {
        if (!todoId) {
            return "";
        }

        return this.s3.getSignedUrl('putObject', {
            Bucket: config.todosBucketName,
            Key: todoId,
            Expires: this.urlExpiration
        });
    }

    deleteObject(todoId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!todoId) {
                    return resolve();
                }

                await this.s3.deleteObject({
                    Bucket: config.todosBucketName,
                    Key: todoId
                }).promise();

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    static getAttachmentUrl(todoId: string): string {
        return `https://${config.todosBucketName}.s3.amazonaws.com/${todoId}`;
    }
};
