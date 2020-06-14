import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS
const bucketName = process.env.IMAGES_S3_BUCKET

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
  
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const newTodoItem = await createTodo(newTodo)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newTodoItem
      })
    }
  }

async function createTodo(createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const newTodoItem = {
    userId: 'userId',
    todoId,
    createdAt,
    ...createTodoRequest,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  console.log('Storing new item: ', newTodoItem)


  await docClient.put({
    TableName: todosTable,
    Item: newTodoItem
  }).promise()

  return newTodoItem
}