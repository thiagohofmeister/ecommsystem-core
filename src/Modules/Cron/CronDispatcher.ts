import { CronTimeEnum } from './Enum/CronTimeEnum'
import { RoutineContract } from './Routines/Contracts/RoutineContract'

export class CronDispatcher {
  constructor() {}

  public async dispatch(cronTime: CronTimeEnum) {
    switch (cronTime) {
      case CronTimeEnum.ONE_MINUTE:
        this.run(this.oneMinute())
        break
    }
  }

  private run(routines: RoutineContract[]) {
    routines.forEach(routine => routine.run())
  }

  private oneMinute() {
    return []
  }
}
