import React from 'react'
import IconPause from './IconPause'
import IconStop from './IconStop'
import { formatTime } from '../utils'

import './timer.css'

function useInterval(cb, delay) {
  const [state, setState] = React.useState(false)
  const savedCallback = React.useRef()

  const start = () => setState(true)
  const pause = () => setState(false)

  React.useEffect(() => {
    savedCallback.current = cb
  }, [cb])

  React.useEffect(() => {
    const tick = () => savedCallback.current()
    if (delay !== null && delay !== undefined && state) {
      tick()
      const timer = setInterval(tick, delay)
      return () => clearInterval(timer)
    }
  }, [delay, state])

  return { start, pause }
}

function useTimer() {
  const [timerState, setTimerState] = React.useState('stopped')
  const [value, setValue] = React.useState(0)

  const { start: startInterval, pause: pauseInterval } = useInterval(() => {
    setValue(value + 1)
    setTimerState('started')
  }, 1000)

  const start = () => {
    setTimerState('started')
    startInterval()
  }

  const pause = () => {
    setTimerState('paused')
    pauseInterval()
  }

  const stop = () => {
    pause()
    setValue(0)
    setTimerState('stopped')
  }

  return { start, pause, stop, value, timerState }
}

export default function Timer() {
  const { start, pause, stop, value, timerState } = useTimer()

  return (
    <div className="timer">
      <h1 className={'timer__counter' + (timerState === 'paused' ? ' blinking' : '')}>
        {formatTime(value)}
      </h1>

      <div className="timer__buttons">
        {(timerState === 'paused' || timerState === 'stopped') && (
          <button type="button" onClick={start} className="timer__button" title="Start">
            ▶
          </button>
        )}
        {timerState === 'started' && (
          <button type="button" onClick={pause} className="timer__button" title="Pause">
            <IconPause />
          </button>
        )}

        {(timerState === 'started' || timerState === 'paused') && (
          <button type="button" onClick={stop} className="timer__button" title="Stop">
            <IconStop />
          </button>
        )}
      </div>
    </div>
  )
}
