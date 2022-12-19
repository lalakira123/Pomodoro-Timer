import { FormContainer, TaskInput, MinutesAmountInput } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="Dê um nome para o seu projeto"
        list="task-sugestion"
        disabled={!!activeCycle}
        {...register('task')}
      />
      <datalist id="task-sugestion">
        <option value="Malhar" />
        <option value="Correr" />
      </datalist>
      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        step={5}
        min={1}
        max={60}
        id="minutesAmount"
        placeholder="00"
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />
      <span>minutos.</span>
    </FormContainer>
  )
}
