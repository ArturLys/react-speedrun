'use client'
import React, { useEffect, useState } from 'react'
import TrafficLight, { LightState } from './TrafficLight'

const TRAFFIC_LIGHT_CONFIG = {
  light1: { green: 10, yellow: 2 },
  light2: { green: 5, yellow: 2 },
  allRedClearance: 1,
}
const INTERRUPT_DURATION_SECONDS = 1.5

const INTERSECTION_STATE_MACHINE: {
  [key: string]: {
    states: [LightState, LightState]
    duration: number
    next: keyof typeof INTERSECTION_STATE_MACHINE | string
    isInterruptible: boolean
  }
} = {
  light1Go: {
    states: ['go', 'stop'],
    duration: TRAFFIC_LIGHT_CONFIG.light1.green,
    next: 'light1Yellow',
    isInterruptible: true,
  },
  light1Yellow: {
    states: ['readyStop', 'stop'],
    duration: TRAFFIC_LIGHT_CONFIG.light1.yellow,
    next: 'allRedTo2',
    isInterruptible: false,
  },
  allRedTo2: {
    states: ['stop', 'stop'],
    duration: TRAFFIC_LIGHT_CONFIG.allRedClearance,
    next: 'light2Go',
    isInterruptible: false,
  },
  light2Go: {
    states: ['stop', 'go'],
    duration: TRAFFIC_LIGHT_CONFIG.light2.green,
    next: 'light2Yellow',
    isInterruptible: false,
  },
  light2Yellow: {
    states: ['stop', 'readyStop'],
    duration: TRAFFIC_LIGHT_CONFIG.light2.yellow,
    next: 'allRedTo1',
    isInterruptible: false,
  },
  allRedTo1: {
    states: ['stop', 'stop'],
    duration: TRAFFIC_LIGHT_CONFIG.allRedClearance,
    next: 'light1Go',
    isInterruptible: false,
  },
}

type IntersectionPhase = keyof typeof INTERSECTION_STATE_MACHINE

export default function TrafficLightPage() {
  const [isOn, setIsOn] = useState(true)
  const [currentPhase, setCurrentPhase] = useState<IntersectionPhase>('light1Go')
  const [isPushed, setIsPushed] = useState(false)

  useEffect(() => {
    if (!isOn) return

    const phaseConfig = INTERSECTION_STATE_MACHINE[currentPhase]
    let duration = phaseConfig.duration

    if (phaseConfig.isInterruptible && isPushed) {
      duration = INTERRUPT_DURATION_SECONDS
    }

    const timerId = setTimeout(() => {
      setCurrentPhase(phaseConfig.next as IntersectionPhase)
    }, duration * 1000)

    return () => clearTimeout(timerId)
  }, [isOn, currentPhase, isPushed])

  useEffect(() => {
    const phaseConfig = INTERSECTION_STATE_MACHINE[currentPhase]
    if (!phaseConfig.isInterruptible && isPushed) {
      setIsPushed(false)
    }
  }, [currentPhase, isPushed])

  const handlePushButton = () => {
    const phaseConfig = INTERSECTION_STATE_MACHINE[currentPhase]
    if (phaseConfig.isInterruptible && !isPushed) {
      setIsPushed(true)
    }
  }

  const [light1State, light2State] = INTERSECTION_STATE_MACHINE[currentPhase].states

  return (
    <div className="flex justify-center gap-16 pt-[20vh]">
      <div className="flex flex-col gap-4 items-center">
        <TrafficLight state={light1State} />
        <button
          onClick={handlePushButton}
          disabled={!INTERSECTION_STATE_MACHINE[currentPhase].isInterruptible || isPushed}
          className={`
          p-2 w-20 bg-green-700 rounded-full text-white font-bold cursor-pointer mt-10 
          hover:bg-green-600 transition-all
          disabled:bg-gray-400 disabled:cursor-not-allowed disabled:text-gray-600
        `}
        >
          Push
        </button>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <TrafficLight state={light2State} />
        <div className="w-20 h-[52px] mt-10" />
      </div>
    </div>
  )
}
