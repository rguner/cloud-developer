export const config = {
    todosBucketName: process.env.TODOS_S3_BUCKET,
    signedUrlExpiration: process.env.SIGNED_URL_EXPIRATION,
    todosTableName: process.env.TODOS_TABLE,
    todosTableIndexName: process.env.TODOS_INDEX_NAME,
    isOffline: process.env.IS_OFFLINE,
    auth0JWKSUrl: process.env.Auth0JWKSUrl
}
