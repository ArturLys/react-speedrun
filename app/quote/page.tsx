'use client'
import React, { useState, useEffect } from 'react'
import QuoteDropdown from './QuoteDropdown'
import { sunTzuQuotes, secretQuotes } from './quotes'
import { useGlobalState } from '../contexts/GlobalContext'

export type Quote = {
  quote: string
  author: string
}

export default function QuotesPage() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [selectedSource, setSelectedSource] = useState<'random' | 'sun tzu' | 'secret'>('random')
  const [allQuotes, setAllQuotes] = useState<Quote[]>([...sunTzuQuotes])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { globalState } = useGlobalState()

  useEffect(() => {
    async function fetchRandomQuotes() {
      try {
        const response = await fetch('https://api.quotable.io/quotes/random?limit=50')
        const randomData = await response.json()
        const randomQuotes = randomData.map((q: any) => ({ quote: q.content, author: q.author }))

        setAllQuotes([...sunTzuQuotes, ...randomQuotes])
      } catch (error) {
        setError("Couldn't fetch quotes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRandomQuotes()
  }, [])

  const handleSelect = (source: 'sun tzu' | 'random' | 'secret') => {
    setSelectedSource(source)
    setCurrentQuote(null)
  }

  const showRandomQuote = () => {
    let potentialQuotes = allQuotes.filter((q) => q.quote !== currentQuote?.quote)

    switch (selectedSource) {
      case 'sun tzu':
        potentialQuotes = potentialQuotes.filter((q) => q.author.toLowerCase() === 'sun tzu')
        break
      case 'secret':
        potentialQuotes = secretQuotes.filter((q) => q !== currentQuote)
        break
      case 'random':
      default:
        potentialQuotes = potentialQuotes.filter((q) => q.author.toLowerCase() !== 'sun tzu')
        break
    }

    if (potentialQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * potentialQuotes.length)
      setCurrentQuote(potentialQuotes[randomIndex])
    }
  }

  const getBackgroundImageUrl = () => {
    switch (selectedSource) {
      case 'sun tzu':
        return 'https://suntzu.noahvdaa.me/images/sun-tzu-statue.jpg'
      case 'secret':
        if (currentQuote?.author.toLowerCase().match('tzu'))
          return '/SunTzuMeme.png'
        else return 'https://content.imageresizer.com/images/memes/Sitting-Wolf-meme-6z9kbk.jpg'
      case 'random':
      default:
        return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'
    }
  }

  const currentBackgroundImageUrl = getBackgroundImageUrl()

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white transition-all duration-500"
      style={{ backgroundImage: `url(${currentBackgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start gap-16 p-4">
        <div className="mt-[20vh] flex items-center gap-8">
          <button className="btn disabled:cursor-not-allowed" onClick={showRandomQuote} disabled={isLoading}>
            {isLoading ? 'Loading Quotes...' : currentQuote ? 'Show Another Quote' : 'Show Quote'}
          </button>
          <QuoteDropdown onSelect={handleSelect} selected={selectedSource} hasSecret={globalState.hasSecretOption} />
        </div>
        <div className="flex h-64 items-center justify-center">
          {currentQuote && (
            <blockquote className="max-w-xl animate-fade-in text-center md:max-w-3xl">
              <p className="text-3xl font-medium italic lg:text-4xl">"{currentQuote.quote}"</p>
              <footer className="mt-6 text-xl text-gray-300">— {currentQuote.author}</footer>
            </blockquote>
          )}
          {error && <div className="text-red-300 absolute top-10">Error: {error}</div>}
        </div>
      </div>
    </div>
  )
}
