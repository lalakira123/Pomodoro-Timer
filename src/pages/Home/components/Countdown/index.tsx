import { useEffect, useContext } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CountDownContainer, Separator } from './styles'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    amountPassed,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      const secondsDifference = differenceInSeconds(
        new Date(),
        new Date(activeCycle.startCycle),
      )

      setSecondsPassed(secondsDifference)

      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startCycle),
        )
        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])

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

  return (
    <CountDownContainer>
      <span>{minutesString[0]}</span>
      <span>{minutesString[1]}</span>
      <Separator>:</Separator>
      <span>{secondsString[0]}</span>
      <span>{secondsString[1]}</span>
    </CountDownContainer>
  )
}
