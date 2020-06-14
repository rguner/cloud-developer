import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

const todosTable = process.env.TODOS
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('updateTodo event', event)
  const todoId = event.pathParameters.todoId
  const updateTodoRequest: UpdateTodoRequest = JSON.parse(event.body)

  const todosList=updateTodo(todoId, updateTodoRequest)

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

async function updateTodo(todoId: string, updateTodoRequest: UpdateTodoRequest): Promise<TodoItem> {
  console.log('Update todo', todoId, updateTodoRequest)

  const result = await docClient.scan({
    TableName: todosTable
  }).promise()

  const items = result.Items
  console.log(items)
  return undefined
}