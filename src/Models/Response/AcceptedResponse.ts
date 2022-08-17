import { ResponseTypeEnum } from '../../Enums/ResponseTypeEnum'
import { SuccessContract } from './SuccessContract'

export class AcceptedResponse<TBody> extends SuccessContract<TBody> {
  getStatus(): number {
    return ResponseTypeEnum.ACCEPTED
  }
}
