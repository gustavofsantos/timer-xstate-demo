import React from 'react'
import { createModel } from '@xstate/test'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'

import { createTimerMachine } from '../machines/timer-machine'
import Timer from './Timer'

const timerMachine = createTimerMachine({
  meta: {
    stopped: {
      test: () => {
        expect(screen.getByTitle(/start/i)).toBeInTheDocument()
        expect(screen.getByText(/00:00/)).toBeInTheDocument()
      }
    },
    started: {
      test: () => {
        expect(screen.getByTitle(/pause/i)).toBeInTheDocument()
        expect(screen.getByTitle(/stop/i)).toBeInTheDocument()
        expect(screen.getByText(/\d\d:\d\d/)).toBeInTheDocument()
      }
    },
    paused: {
      test: () => {
        expect(screen.getByTitle(/start/i)).toBeInTheDocument()
        expect(screen.getByTitle(/stop/i)).toBeInTheDocument()
        expect(screen.getByText(/\d\d:\d\d/)).toBeInTheDocument()
      }
    }
  }
})

const timerModel = createModel(timerMachine).withEvents({
  START: () => {
    user.click(screen.getByTitle(/start/i))
  },
  PAUSE: () => {
    user.click(screen.getByTitle(/pause/i))
  },
  STOP: () => {
    user.click(screen.getByTitle(/stop/i))
  }
})

describe('Timer model tests', () => {
  const testPlans = timerModel.getSimplePathPlans({
    filter: (state) => state.context.value < 10
  })

  testPlans.forEach((plan) => {
    describe(plan.description, () => {
      plan.paths.forEach((path) => {
        test(path.description, async () => {
          render(<Timer />)
          path.test()
        })
      })
    })
  })

  test('should cover all states', () => {
    return timerModel.testCoverage()
  })
})
