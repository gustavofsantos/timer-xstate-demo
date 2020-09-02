import React from 'react'
import { useMachine } from '@xstate/react'
import IconPause from './IconPause'
import IconStop from './IconStop'
import { createTimerMachine } from '../machines/timer-machine'

import './timer.css'

function useTimer() {
  const [current, send] = useMachine(createTimerMachine())

  const value = current.context.value

  const start = () => send('START')
  const pause = () => send('PAUSE')
  const stop = () => send('STOP')

  return { start, pause, stop, state: current, value }
}

export default function Timer() {
  const { start, pause, stop, state, value } = useTimer()

  return (
    <div className="timer">
      <h1
        className={
          'timer__counter' + (state.matches('paused') ? ' blinking' : '')
        }
      >
        {value}
      </h1>

      <div className="timer__buttons">
        {(state.matches('paused') || state.matches('stopped')) && (
          <button type="button" onClick={start} className="timer__button">
            ▶
          </button>
        )}
        {state.matches('started') && (
          <button type="button" onClick={pause} className="timer__button">
            <IconPause />
          </button>
        )}

        {(state.matches('started') || state.matches('paused')) && (
          <button type="button" onClick={stop} className="timer__button">
            <IconStop />
          </button>
        )}
      </div>
    </div>
  )
}
