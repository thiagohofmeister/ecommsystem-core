import { Request, Response, NextFunction } from 'express'
import { BadRequestException } from '../Models/Exceptions/BadRequestException'
import { BaseError } from '../Models/Exceptions/BaseError'
import { ConflictException } from '../Models/Exceptions/ConflictException'
import { DataNotFoundException } from '../Models/Exceptions/DataNotFoundException'
import { InvalidDataException } from '../Models/Exceptions/InvalidDataException'
import { UnauthorizedException } from '../Models/Exceptions/UnauthorizedException'

export class ErrorHandler {
  constructor() {
    this.notFound = this.notFound.bind(this)
    this.error = this.error.bind(this)
    this.getResponseBody = this.getResponseBody.bind(this)
    this.getHttpStatusCode = this.getHttpStatusCode.bind(this)
  }

  public notFound(request: Request, response: Response, next: NextFunction) {
    return this.error(
      new DataNotFoundException('Resource not found.').setCode(
        'resourceNotFound'
      ),
      request,
      response,
      next
    )
  }

  public error(
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    let httpStatusCode = this.getHttpStatusCode(error)

    if (httpStatusCode === 500) {
      console.error(error)
    }

    response
      .status(httpStatusCode)
      .json(this.getResponseBody(error, httpStatusCode))
  }

  private getResponseBody(error: Error, httpStatusCode: number) {
    if (error instanceof BaseError) {
      return {
        message: error.message,
        code: `${httpStatusCode}.${error.getCode()}`,
        reasons: error.getReasons()
      }
    }

    return {
      code: `${httpStatusCode}.internalServerError`,
      message: error.message,
      reasons: []
    }
  }

  private getHttpStatusCode(error: Error): number {
    if (error instanceof UnauthorizedException) {
      return 401
    }

    if (error instanceof DataNotFoundException) {
      return 404
    }

    if (error instanceof InvalidDataException) {
      return 422
    }

    if (error instanceof ConflictException) {
      return 409
    }

    if (error instanceof BadRequestException) {
      return 400
    }

    return 500
  }
}
