'use client'
import { Button } from '@headlessui/react'
import React, { useEffect, useState } from 'react'

export default function Stopwatch() {
  const [timerState, setTimerState] = useState<'stopped' | 'running' | 'paused'>('stopped')
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<number[]>([])

  useEffect(() => {
    if (timerState !== 'running') return

    const start = performance.now() - elapsed
    const interval = setInterval(() => {
      setElapsed(performance.now() - start)
    }, 1)

    return () => clearInterval(interval)
  }, [timerState])

  return (
    <div className="flex items-center justify-center flex-col pb-16">
      <div className="w-64 h-64 border-2 border-white-t/20 rounded-full flex flex-col gap-4 items-center justify-center mt-[20vh]">
        <div className="text-2xl font-semibold">{(elapsed / 1000).toFixed(3)}</div>
        <div className="flex gap-4">
          <Button
            className="btn"
            onClick={() => {
              setTimerState(timerState === 'running' ? 'paused' : 'running')
            }}
          >
            {timerState === 'running' ? 'Stop' : 'Start'}
          </Button>
          {timerState === 'stopped' ? (
            <Button className="hover:cursor-default bg-secondary p-3 rounded-xl font-semibold" disabled>
              Reset
            </Button>
          ) : (
            <Button
              className="btn"
              onClick={() => {
                if (timerState === 'paused') {
                  setLaps([])
                  setTimerState('stopped')
                  setElapsed(0)
                } else if (timerState === 'running') {
                  setLaps([...laps, elapsed - (laps.reduce((acc, lap) => acc + lap, 0) || 0)])
                }
              }}
            >
              {timerState === 'running' ? 'Lap' : 'Reset'}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 w-full max-w-md flex flex-col items-center gap-2">
        <div
          className={`flex gap-8 justify-between w-full px-4 ${
            laps.length === 0 && timerState === 'stopped' ? 'opacity-0' : ''
          }`}
        >
          <span>Lap {laps.length + 1}</span>
          <span>{((elapsed - laps.reduce((acc, lap) => acc + lap, 0)) / 1000).toFixed(3)}</span>
        </div>
        {laps
          .slice()
          .reverse()
          .map((lap, i, arr) => {
            const originalIndex = laps.length - 1 - i
            const isFastest = originalIndex === laps.indexOf(Math.min(...laps.slice().reverse()))
            const isSlowest = originalIndex === laps.indexOf(Math.max(...laps.slice().reverse()))

            return (
              <div
                key={originalIndex}
                className={`flex gap-8 justify-between w-full px-4 ${
                  laps.length >= 2 && (isFastest ? 'text-green-600' : isSlowest ? 'text-red-500' : '')
                }`}
              >
                <span>Lap {originalIndex + 1}</span>
                <span>{(lap / 1000).toFixed(3)}</span>
              </div>
            )
          })}
      </div>
    </div>
  )
}
