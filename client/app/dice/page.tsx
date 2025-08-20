'use client'
import { Button } from '@headlessui/react'
import React, { useState } from 'react'
import Dice from './Dice'
import StickyBox from 'react-sticky-box'

export default function DicePage() {
  const [diceValues, setDiceValues] = useState<number[]>([1, 1])
  const [animateRoll, setAnimateRoll] = useState<boolean[]>(Array(100).fill(false))

  const rollAll = () => {
    setDiceValues((prev) => prev.map(() => Math.ceil(Math.random() * 6)))
    setAnimateRoll((prev) => prev.map(() => true))
    setTimeout(() => setAnimateRoll((prev) => prev.map(() => false)), 300)
  }

  const roll = (index: number) => {
    const newValues = [...diceValues]
    newValues[index] = Math.ceil(Math.random() * 6)
    setDiceValues(newValues)
    setAnimateRoll((prev) => {
      const newAnimateRoll = [...prev]
      newAnimateRoll[index] = true
      return newAnimateRoll
    })
    setTimeout(
      () =>
        setAnimateRoll((prev) => {
          const newAnimateRoll = [...prev]
          newAnimateRoll[index] = false
          return newAnimateRoll
        }),
      500
    )
  }

  const addDice = () => {
    if (diceValues.length >= 999) return
    setDiceValues((prev) => [...prev, 1])
  }

  const removeDice = (index: number) => {
    if (diceValues.length <= 1) return
    setDiceValues((prev) => prev.filter((_, i) => i !== index))
  }

  const setDiceCount = (count: number) => {
    if (isNaN(count)) return

    const clamped = Math.min(999, Math.max(1, count))

    setDiceValues((prev) => {
      const current = prev.length
      if (clamped > current) {
        return [...prev, ...Array(clamped - current).fill(1)]
      } else {
        return prev.slice(0, clamped)
      }
    })
  }

  const getProbabilityData = (
    target: number,
    diceCount: number
  ): {
    label: string
    probability: string
  } => {
    if (diceCount <= 30) {
      const maxSum = diceCount * 6
      const dp = Array.from({ length: diceCount + 1 }, () => Array(maxSum + 1).fill(0))
      dp[0][0] = 1

      for (let i = 1; i <= diceCount; i++) {
        for (let j = i; j <= i * 6; j++) {
          for (let face = 1; face <= 6; face++) {
            if (j - face >= 0) dp[i][j] += dp[i - 1][j - face]
          }
        }
      }

      const totalWays = 6 ** diceCount
      const atLeast = dp[diceCount].slice(target).reduce((a, b) => a + b, 0)
      const atMost = dp[diceCount].slice(0, target + 1).reduce((a, b) => a + b, 0)

      const probAtLeast = atLeast / totalWays
      const probAtMost = atMost / totalWays

      if (probAtLeast < probAtMost) {
        return {
          label: `Probability of rolling at least ${target} in a single roll`,
          probability: `${(probAtLeast * 100).toFixed(6)}%`,
        }
      } else {
        return {
          label: `Probability of rolling at most ${target} in a single roll`,
          probability: `${(probAtMost * 100).toFixed(6)}%`,
        }
      }
    }

    // Normal approx
    const mean = diceCount * 3.5
    const stdDev = Math.sqrt(diceCount * (35 / 12))
    const erf = (x: number) => {
      const sign = x < 0 ? -1 : 1
      x = Math.abs(x)
      const t = 1 / (1 + 0.3275911 * x)
      const y =
        1 -
        ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
          t *
          Math.exp(-x * x)
      return sign * y
    }
    const normalCDF = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2))

    const z = (target - 0.5 - mean) / stdDev
    const probAtLeast = 1 - normalCDF(z)
    const probAtMost = normalCDF(z + 1 / stdDev)

    if (probAtLeast < probAtMost) {
      return {
        label: `Probability of rolling at least ${target} in a single roll`,
        probability: `${(probAtLeast * 100).toFixed(6)}%`,
      }
    } else {
      return {
        label: `Probability of rolling at most ${target} in a single roll`,
        probability: `${(probAtMost * 100).toFixed(6)}%`,
      }
    }
  }

  const total = diceValues.reduce((a, b) => a + b, 0)
  const { label, probability } = getProbabilityData(total, diceValues.length)

  return (
    <div className="flex justify-center items-center flex-col gap-4 pb-16">
      <div className="relative w-full">
        <div className="sticky top-4 z-10 text-center mt-4">
          <div>
            Total: {total} / {diceValues.length * 6}
          </div>
          <div>Average: {(total / (diceValues.length || 1)).toFixed(2)} / 6</div>
          <div title={label} className="underline cursor-help">
            {probability}
          </div>
        </div>
        <div className="mt-[20vh]" />
      </div>
      <div className="gap-4 flex leading-none items-center">
        <button
          className="btn w-8 h-8 p-1 flex items-center justify-center"
          onClick={() => removeDice(diceValues.length - 1)}
        >
          -
        </button>
        <input
          min={1}
          max={999}
          type="text"
          value={diceValues.length}
          className="outline-none w-7 text-center font-semibold"
          onChange={(e) => setDiceCount(Number(e.target.value))}
        />
        <button className="btn w-8 h-8 p-1 flex items-center justify-center" onClick={addDice}>
          +
        </button>
      </div>
      <Button className="btn" onClick={rollAll}>
        Roll All
      </Button>
      <div className="text-center max-w-6xl">
        {diceValues.map((value, index) => (
          <button className="cursor-pointer" key={index} onClick={() => roll(index)}>
            <Dice value={value} shake={animateRoll[index]} />
          </button>
        ))}
      </div>
    </div>
  )
}
