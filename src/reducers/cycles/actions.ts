import { Cycle } from './reducer'

export enum ActionType {
  CREATE_NEW_CYCLE = 'CREATE_NEW_CYCLE',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export function createNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionType.CREATE_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function interruptCurrentCycleAction(activeCycleId: string | null) {
  return {
    type: ActionType.INTERRUPT_CURRENT_CYCLE,
    payload: {
      activeCycleId,
    },
  }
}

export function markCurrentCycleAsFinishedAction(activeCycleId: string | null) {
  return {
    type: ActionType.MARK_CURRENT_CYCLE_AS_FINISHED,
    payload: {
      activeCycleId,
    },
  }
}
