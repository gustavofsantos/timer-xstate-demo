import { Machine, assign } from 'xstate'

export const createTimerMachine = () =>
  Machine({
    id: 'timer-machine',
    context: {
      value: 0
    },
    initial: 'stopped',
    states: {
      stopped: {
        entry: assign({ value: 0 }),
        on: {
          START: 'started'
        }
      },
      started: {
        invoke: {
          src: (ctx) => (cb) => {
            const interval = setInterval(() => cb('TICK'), 1000)
            return () => clearInterval(interval)
          }
        },
        on: {
          TICK: {
            actions: assign({ value: (ctx) => ctx.value + 1 })
          },
          PAUSE: 'paused',
          STOP: 'stopped'
        }
      },
      paused: {
        on: {
          START: 'started',
          STOP: 'stopped'
        }
      }
    }
  })
