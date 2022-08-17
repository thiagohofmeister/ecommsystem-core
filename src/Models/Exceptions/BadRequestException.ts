import { BaseError } from './BaseError'

export class BadRequestException extends BaseError {
  constructor(message: string = 'Bad request.') {
    super(message)
  }
}
