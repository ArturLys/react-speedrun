'use client'
import { Button } from '@headlessui/react'

export default function ResetRPCDataButton() {
  return (
    <Button
      onClick={() => {
        if (confirm('Are you sure you want to reset your Rock Paper Scissors data?')) {
          localStorage.removeItem('wins')
          localStorage.removeItem('losses')
          localStorage.removeItem('gameCount')
          localStorage.removeItem('lastPlayerChoice')
          localStorage.removeItem('lastAiChoice')
          localStorage.removeItem('lastGameResult')
          location.reload()
        }
      }}
      className="p-1 z-10 hover:cursor-pointer text-white-t/80 hover:text-white-t"
    >
      Reset Data
    </Button>
  )
}
