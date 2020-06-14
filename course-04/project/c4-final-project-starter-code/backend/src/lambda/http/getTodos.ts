import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodoItem } from '../../models/TodoItem'

const todosTable = process.env.TODOS
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('getTodos event', event)
  const todosList=getAllTodos()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todosList
    })
  }

}

async function getAllTodos(): Promise<TodoItem[]> {
  console.log('Getting all todos')

  const result = await docClient.scan({
    TableName: todosTable
  }).promise()

  const items = result.Items
  return items as TodoItem[]
}