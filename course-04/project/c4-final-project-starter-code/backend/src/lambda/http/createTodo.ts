import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
  
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const newItem = await createTodo(newTodo)
  
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }

async function createTodo(createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

  const todoId = uuid.v4()
  const createdAt = new Date().toISOString()
  const newItem = {
    todoId,
    createdAt,
    ...createTodoRequest,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }
  console.log('Storing new item: ', newItem)


  await this.docClient.put({
    TableName: this.todosTable,
    Item: newItem
  }).promise()

  return newItem
}