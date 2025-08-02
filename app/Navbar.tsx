'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppleButton from './stopwatch/AppleButton'
import ResetRPCDataButton from './rock-paper-scissors/RestartData'
import AddSecretQuoteButton from './quote-generator/AddSecretQuoteButton'

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [enabled, setEnabled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setEnabled(resolvedTheme === 'dark')
  }, [resolvedTheme])

  const toggle = (checked: boolean) => {
    setEnabled(checked)
    setTheme(checked ? 'dark' : 'light')
  }

  return (
    <nav className="flex items-center justify-between p-3 border-b border-white-t/20">
      <div className="flex gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white-t/80 hover:text-white-t p-1">
            Home
          </Link>
        </div>
        {pathname === '/stopwatch' && <AppleButton />}
        {pathname === '/rock-paper-scissors' && <ResetRPCDataButton />}
        {pathname === '/quote-generator' && <AddSecretQuoteButton />}
      </div>
      <Switch
        checked={enabled}
        onChange={toggle}
        className={clsx(
          'relative flex h-8 w-16 items-center rounded-full transition-colors p-1 hover:cursor-pointer',
          enabled ? 'bg-white-t/20' : 'bg-white-t/20'
        )}
      >
        <div className="absolute right-1 text-white-t/40">
          <SunIcon className="h-5 w-5" />
        </div>
        <div className="absolute left-1 text-white-t/40">
          <MoonIcon className="h-5 w-5" />
        </div>
        <span
          aria-hidden="true"
          className={clsx(
            'inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition',
            enabled ? 'translate-x-8' : 'translate-x-0'
          )}
        />
      </Switch>
    </nav>
  )
}
