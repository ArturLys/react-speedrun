import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const QUOTE_SOURCES = {
  RANDOM: 'random',
  SUN_TZU: 'sun tzu',
  SECRET: 'secret',
} as const

type QuoteSource = (typeof QUOTE_SOURCES)[keyof typeof QUOTE_SOURCES]

type QuoteDropdownProps = {
  selected: QuoteSource
  onSelect: (source: QuoteSource) => void
  hasSecret?: boolean
}

const menuItems = [
  { id: QUOTE_SOURCES.RANDOM, label: 'Random' },
  { id: QUOTE_SOURCES.SUN_TZU, label: 'Sun Tzu' },
] as const

export default function QuoteDropdown({ selected, onSelect, hasSecret }: QuoteDropdownProps) {
  const allMenuItems = hasSecret ? [...menuItems, { id: QUOTE_SOURCES.SECRET, label: 'Secret' }] : menuItems
  const selectedLabel = allMenuItems.find((item) => item.id === selected)?.label || 'Select Source'

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-white-t font-semibold focus:outline-none data-[hover]:bg-secondary/90 data-[open]:bg-secondary/90">
        {selectedLabel}
        <ChevronDownIcon className="h-4 w-4 text-white-t/60" />
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute mt-2 flex w-40 flex-col gap-1 origin-top-right rounded-xl bg-secondary p-1 text-sm/6 text-white-t focus:outline-none">
          {allMenuItems.map((item) => (
            <MenuItem key={item.id}>
              {(props) => (
                <button
                  onClick={() => onSelect(item.id)}
                  className={clsx('flex w-full items-center rounded-lg px-3 py-1.5', {
                    'bg-primary/15': props.active || selected === item.id,
                  })}
                >
                  {item.label}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  )
}
