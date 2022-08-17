import { Request } from 'express'
import { ApiContext } from '../Interfaces/ApiContext'

export interface CoreRequest extends Request {
  context: ApiContext
}
