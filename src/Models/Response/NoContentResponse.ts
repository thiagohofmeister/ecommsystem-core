import { ResponseTypeEnum } from '../../Enums/ResponseTypeEnum'
import { SuccessContract } from './SuccessContract'

export class NoContentResponse<TBody> extends SuccessContract<TBody> {
  getStatus(): number {
    return ResponseTypeEnum.NO_CONTENT
  }
}
