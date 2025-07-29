'use client'
import { Button } from '@headlessui/react'
import React, { useEffect, useState } from 'react'

export default function BadAppleButton() {
  const [frames, setFrames] = useState<string[]>([])
  const [playing, setPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)

  useEffect(() => {
    if (!playing) return

    const fetchFrames = async () => {
      const res = await fetch('/appleFrames.json')
      const data = await res.json()
      setFrames(data)
    }

    fetchFrames()
  }, [playing])

  useEffect(() => {
    if (!playing || frames.length === 0) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length)
    }, 33)

    return () => clearInterval(interval)
  }, [playing, frames])

  return (
    <div className="flex">
      {!playing && (
        <Button onClick={() => setPlaying(true)} className="bg-primary p-2 rounded-lg z-10">
          top secret button DO NOT PRESS
        </Button>
      )}

      {playing && frames.length > 0 && (
        <div className="top-full mt-2 overflow-hidden bg-black text-white text-[6px] leading-[6px] font-mono p-1">
          <pre>{frames[currentFrame]}</pre>
        </div>
      )}
    </div>
  )
}
