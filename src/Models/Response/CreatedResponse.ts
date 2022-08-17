import { ResponseTypeEnum } from '../../Enums/ResponseTypeEnum'
import { SuccessContract } from './SuccessContract'

export class CreatedResponse<TBody> extends SuccessContract<TBody> {
  getStatus(): number {
    return ResponseTypeEnum.CREATED
  }
}
