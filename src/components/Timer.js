import React from 'react'
import IconPause from './IconPause'
import IconStop from './IconStop'

import './timer.css'

export default function Timer() {
  const [timerState, setTimerState] = React.useState('stopped')
  const [counter, setCounter] = React.useState(0)

  const start = () => setTimerState('started')

  const pause = () => setTimerState('paused')

  const stop = () => {
    setTimerState('stopped')
    setCounter(0)
  }

  React.useEffect(() => {
    if (timerState === 'started') {
      setTimeout(() => {
        setCounter(counter + 1)
      }, 1000)
    }
  }, [counter, timerState])

  return (
    <div className="timer">
      <h1
        className={
          'timer__counter' + (timerState === 'paused' ? ' blinking' : '')
        }
      >
        {counter}
      </h1>

      <div className="timer__buttons">
        <button type="button" onClick={start} className="timer__button">
          ▶
        </button>
        <button type="button" onClick={pause} className="timer__button">
          <IconPause />
        </button>
        <button type="button" onClick={stop} className="timer__button">
          <IconStop />
        </button>
      </div>
    </div>
  )
}
