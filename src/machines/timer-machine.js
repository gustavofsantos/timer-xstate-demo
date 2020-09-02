import { Machine, assign } from 'xstate'

const defaultConfig = {
  meta: {
    started: {},
    stopped: {},
    paused: {}
  }
}

export const createTimerMachine = (config = defaultConfig) =>
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
        },
        meta: { ...config.meta.stopped }
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
        },
        meta: { ...config.meta.started }
      },
      paused: {
        on: {
          START: 'started',
          STOP: 'stopped'
        },
        meta: { ...config.meta.paused }
      }
    }
  })
