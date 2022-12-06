import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodoRequest: CreateTodoRequest = JSON.parse(event.body);
    const userId: string = getUserId(event);
    try {
      const newTodo: TodoItem = await createTodo(userId, newTodoRequest);
      logger.info('Successfully created a new todo item.');
      return {
        statusCode: 201,
        body: JSON.stringify({ newTodo })
      };
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      throw error;
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
