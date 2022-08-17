import { NextFunction, Response } from 'express'

import { ResponseTypeEnum } from '../Enums/ResponseTypeEnum'
import { CoreRequest } from '../Models/Request/CoreRequest'
import { AcceptedResponse } from '../Models/Response/AcceptedResponse'
import { CreatedResponse } from '../Models/Response/CreatedResponse'
import { NoContentResponse } from '../Models/Response/NoContentResponse'
import { OkResponse } from '../Models/Response/OkResponse'
import { SuccessContract } from '../Models/Response/SuccessContract'
import { ViewContract } from '../Views/Contracts/ViewContract'

export abstract class BaseController {
  constructor() {}

  protected async responseHandler(
    response: Response,
    next: NextFunction,
    promise: any,
    responseType: ResponseTypeEnum,
    view?: ViewContract
  ): Promise<void> {
    try {
      const body = await promise

      if (!view) {
        view = this.getView()
      }

      this.successResponseHandler(
        this.buildSuccessResponse(responseType, view.render(body)),
        response
      )
    } catch (error) {
      next(error)
    }
  }

  private successResponseHandler(result: SuccessContract, response: Response) {
    response.status(result.getStatus())

    if (result instanceof NoContentResponse) {
      response.send()
      return
    }

    response.json(result.getBody())
  }

  private buildSuccessResponse(
    responseType: ResponseTypeEnum,
    body: any
  ): SuccessContract {
    if (!body) {
      return new NoContentResponse()
    }

    switch (responseType) {
      case ResponseTypeEnum.OK:
        return new OkResponse(body)

      case ResponseTypeEnum.CREATED:
        return new CreatedResponse(body)

      case ResponseTypeEnum.ACCEPTED:
        return new AcceptedResponse(body)

      case ResponseTypeEnum.NO_CONTENT:
        return new NoContentResponse()

      default:
        throw new Error(`Response type ${responseType} is not implemented.`)
    }
  }

  protected abstract getView()

  protected abstract getFacade(request: CoreRequest)
}
