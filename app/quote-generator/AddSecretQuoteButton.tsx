'use client'
import { useState } from 'react'
import { Button } from '@headlessui/react'
import { useGlobalState } from '../contexts/GlobalContext'

export default function AddSecretQuoteButton() {
  const { globalState, setGlobalState } = useGlobalState()

  const [isHiding, setIsHiding] = useState(false)

  const handleClick = () => {
    setIsHiding(true)

    setTimeout(() => {
      setGlobalState((prevState) => ({
        ...prevState,
        hasSecretOption: true,
      }))
    }, 500)
  }

  if (globalState.hasSecretOption) {
    return null
  }

  return (
    <Button
      onClick={handleClick}
      className={`
        p-1 z-10 
        hover:cursor-pointer text-white-t/80 hover:text-white-t
        bg-transparent
        transition-opacity duration-500 ease-in-out 
        ${isHiding ? 'opacity-0' : 'opacity-100'}
      `}
      disabled={isHiding}
    >
      Secret
    </Button>
  )
}
