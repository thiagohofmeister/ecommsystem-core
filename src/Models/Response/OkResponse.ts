import { ResponseTypeEnum } from '../../Enums/ResponseTypeEnum'
import { SuccessContract } from './SuccessContract'

export class OkResponse<TBody> extends SuccessContract<TBody> {
  getStatus(): number {
    return ResponseTypeEnum.OK
  }
}
