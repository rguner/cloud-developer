import {CustomAuthorizerEvent, CustomAuthorizerResult} from 'aws-lambda'
import 'source-map-support/register'

import {createLogger} from '../../utils/logger'
import {JwtPayload} from '../../auth/JwtPayload'
import {AuthHelper} from "../../utils/authHelper";

const logger = createLogger('auth')

export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    logger.info('Authorizing a user', event.authorizationToken)
    try {
        const jwtToken = await verifyToken(event.authorizationToken)
        logger.info('User was authorized', jwtToken)

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', {error: e.message})

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
    return new Promise(async (resolve, reject) => {
        try {
            const token = AuthHelper.getJWTToken(authHeader);
            const jwt = AuthHelper.decodeJWTToken(token);
            const signingKey = await AuthHelper.getSigningKey(jwt);
            const payload = AuthHelper.verifyToken(token, signingKey.getPublicKey());
            resolve(payload);
        } catch (error) {
            reject(error);
        }
    });

}


