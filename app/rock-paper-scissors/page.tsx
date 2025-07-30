'use client'
import { Button, Input } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'

export default function RPC() {
  const inputRef = useRef<HTMLInputElement>(null)

  const [wins, setWins] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wins')
      return saved !== null ? parseInt(saved, 10) : 0
    }
    return 0
  })

  const [losses, setLosses] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('losses')
      return saved !== null ? parseInt(saved, 10) : 0
    }
    return 0
  })

  const [gameCount, setGameCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gameCount')
      return saved !== null ? parseInt(saved, 10) : 0
    }
    return 0
  })

  const [lastPlayerChoice, setLastPlayerChoice] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastPlayerChoice')
      return saved !== null ? saved : 'rock'
    }
    return 'rock'
  })

  const [lastAiChoice, setLastAiChoice] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastAiChoice')
      return saved !== null ? saved : 'gun 🔫'
    }
    return 'gun 🔫'
  })

  const [lastGameResult, setLastGameResult] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastGameResult')
      return saved !== null ? saved : 'lost'
    }
    return 'lost'
  })

  const [playerChoice, setPlayerChoice] = useState<string | null>(null)
  const [aiChoice, setAiChoice] = useState<string | null>(null)
  const [gameState, setGameState] = useState<'aiChoosing' | 'playerChoosing' | 'win' | 'lose' | 'draw'>(
    'playerChoosing'
  )
  const [aiThinkingMessage, setAiThinkingMessage] = useState('AI is thinking...')

  const [resultMessage, setResultMessage] = useState('')

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      const value = inputRef.current?.value.trim()
      if (value) {
        setPlayerChoice(value)
      }
    }
  }

  useEffect(() => {
    if (!playerChoice) return

    setGameState('aiChoosing')

    if (gameCount <= 1) {
      setTimeout(() => {
        const newAiChoice = playerChoice === 'rock' ? 'scissors ✂️' : playerChoice === 'paper' ? 'rock 🪨' : 'paper 📄'
        setAiChoice(newAiChoice)

        const reasons = {
          rock: 'smashes',
          paper: 'covers',
          scissors: 'cut',
        }
        setResultMessage(
          `${playerChoice} ${reasons[playerChoice as keyof typeof reasons]} ${newAiChoice.replace(/[^a-zA-Z ]/g, '')}`
        )
        setGameState('win')
        setWins((prev) => prev + 1)
        setPlayerChoice(null)
        setGameCount((prev) => prev + 1)
      }, 1000)
    }
    if (gameCount === 2) {
      setAiThinkingMessage('Hmmm...')
      setTimeout(() => {
        setAiThinkingMessage('I have an idea...')
        setTimeout(() => {
          setAiChoice('gun 🔫')
          setResultMessage(`gun destroys ${playerChoice}`)
          setGameState('lose')
          setLosses((prev) => prev + 1)
          setPlayerChoice(null)
          setGameCount((prev) => prev + 1)
        }, 3000)
      }, 2000)
    }
    if (gameCount >= 3) {
      const getAiResponse = async () => {
        try {
          setAiThinkingMessage('AI is thinking...')
          const response = await fetch('/api/rpc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              playerChoice,
              lastPlayerChoice,
              lastAiChoice,
              lastGameResult: lastGameResult,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'An unknown error occurred')
          }

          const aiGeneratedChoice = data.aiChoice.toLowerCase().trim()
          setAiChoice(aiGeneratedChoice)

          const resultMessage = data.resultMessage.toLowerCase().trim()
          setResultMessage(resultMessage)

          const gameResult = data.gameResult.toLowerCase().trim()
          if (gameResult === 'win') {
            setGameState('win')
            setWins((prev) => prev + 1)
          } else if (gameResult === 'lose') {
            setGameState('lose')
            setLosses((prev) => prev + 1)
          } else {
            setGameState('draw')
          }

          setLastPlayerChoice(playerChoice)
          setLastAiChoice(aiGeneratedChoice)
          setLastGameResult(gameResult)
        } catch (error) {
          console.error('Error fetching AI choice:', error)
        } finally {
          setPlayerChoice(null)
          setGameCount((prev) => prev + 1)
        }
      }

      getAiResponse()
    }
  }, [playerChoice, gameCount, wins, losses, resultMessage, lastPlayerChoice, lastAiChoice])

  useEffect(() => {
    localStorage.setItem('wins', wins.toString())
    localStorage.setItem('losses', losses.toString())
    localStorage.setItem('gameCount', gameCount.toString())
    localStorage.setItem('lastPlayerChoice', lastPlayerChoice || '')
    localStorage.setItem('lastAiChoice', lastAiChoice || '')
    localStorage.setItem('lastGameResult', lastGameResult || '')
  }, [wins, losses, gameCount, lastPlayerChoice, lastAiChoice, lastGameResult])

  const results = {
    win: { text: 'You win!', color: 'text-green-600' },
    lose: { text: 'You lose!', color: 'text-red-500' },
    draw: { text: "It's a draw!", color: 'text-gray-500' },
  }

  return (
    <div className="flex items-center justify-center flex-col gap-4 pt-[30vh]">
      {gameState === 'aiChoosing' && <div className="text-2xl font-semibold">{aiThinkingMessage}</div>}
      {['win', 'lose', 'draw'].includes(gameState) &&
        (() => {
          const { text, color } = results[gameState as keyof typeof results]
          return (
            <>
              <div className="text-2xl font-semibold max-w-120 text-center">
                AI choses {aiChoice && aiChoice.charAt(0).toUpperCase() + aiChoice.slice(1)}
              </div>
              <div className="text-xl font-semibold text-white-t/50 max-w-100 text-center">{resultMessage}</div>
              <div className={`${color} text-2xl font-semibold flex flex-col items-center gap-4`}>{text}</div>
              <Button onClick={() => setGameState('playerChoosing')} className="btn w-36">
                Play again
              </Button>
            </>
          )
        })()}
      {gameState === 'playerChoosing' && (
        <>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setPlayerChoice('rock')} className="btn w-24">
              Rock 🪨
            </Button>
            <Button onClick={() => setPlayerChoice('paper')} className="btn w-24">
              Paper 📄
            </Button>
            <Button onClick={() => setPlayerChoice('scissors')} className="btn w-28">
              Scissors ✂️
            </Button>
          </div>
          {gameCount >= 3 && (
            <div className="flex">
              <Input
                ref={inputRef}
                type="text"
                name="choice"
                id="choice"
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder="Something else..."
                className="border border-white-t p-3 rounded-l-xl font-semibold bg-transparent w-64 focus:outline-none"
              />
              <Button
                className="hover:cursor-pointer bg-primary p-3 rounded-r-xl font-semibold w-20 border-y border-r border-white-t"
                type="submit"
                onClick={() => {
                  const value = inputRef.current?.value.trim()
                  if (value) setPlayerChoice(value)
                }}
              >
                Submit
              </Button>
            </div>
          )}
        </>
      )}
      {gameCount > 0 && (
        <div
          className={`absolute bottom-4 right-4 text-lg font-semibold ${
            wins / (wins + losses) >= 0.5 ? 'text-green-600' : 'text-red-500'
          }`}
        >
          Win rate: {((wins / (wins + losses)) * 100).toFixed(1)}%
        </div>
      )}
    </div>
  )
}
