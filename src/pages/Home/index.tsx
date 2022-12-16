import { useState, useEffect } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  InterruptCycleButton,
  MinutesAmountInput,
  Separator,
  StartCountDownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa.'),
  minutesAmount: zod.number().min(1).max(60),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startCycle: Date
  interruptCycle?: Date
  finishedCycle?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountPassed, setAmountPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  function handleNewCycleSubmit(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startCycle: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptCycle: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycleId) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startCycle,
        )
        if (secondsDifference >= totalSeconds) {
          setCycles(
            cycles.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedCycle: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setActiveCycleId(null)
          clearInterval(interval)
        } else {
          setAmountPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, activeCycleId, cycles, totalSeconds])

  const currentSeconds = totalSeconds - amountPassed

  const minutes = activeCycle ? Math.floor(currentSeconds / 60) : 0
  const seconds = activeCycle ? currentSeconds % 60 : 0

  const minutesString = String(minutes).padStart(2, '0')
  const secondsString = String(seconds).padStart(2, '0')

  useEffect(() => {
    if (activeCycleId) {
      document.title = `${minutesString}:${secondsString}`
    } else {
      document.title = 'Pomodoro Timer'
    }
  }, [minutesString, secondsString, activeCycleId])

  const task = watch('task')
  const isDisabledSubmit = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleNewCycleSubmit)}>
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

        <CountDownContainer>
          <span>{minutesString[0]}</span>
          <span>{minutesString[1]}</span>
          <Separator>:</Separator>
          <span>{secondsString[0]}</span>
          <span>{secondsString[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <InterruptCycleButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </InterruptCycleButton>
        ) : (
          <StartCountDownButton type="submit" disabled={isDisabledSubmit}>
            <Play size={24} />
            Começar
          </StartCountDownButton>
        )}
      </form>
    </HomeContainer>
  )
}
