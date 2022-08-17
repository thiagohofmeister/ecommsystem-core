import { IViewResponse } from '../../Views/Interfaces/IViewResponse'

export abstract class SuccessContract<TBody = IViewResponse> {
  constructor(private body?: TBody) {}

  public getBody(): TBody {
    return this.body
  }

  abstract getStatus(): number
}
