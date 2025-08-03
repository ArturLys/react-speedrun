// ! HOLY MOLLY VIBE CODING GOES CRAZY LMAO
'use client'
import React, { useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import CircularSlider from 'react-circular-slider-svg'
import { XMarkIcon, PlusIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/solid'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import clsx from 'clsx'

// --- UTILITY FUNCTIONS ---
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.min(255, Math.max(0, x)).toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

// A reusable class to hide the arrows on number inputs
const numberInputClass = `
  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
`

// --- MAIN COMPONENT ---
export default function GradientPage() {
  const [colors, setColors] = useState<string[]>(['#6a33ca', '#f2af33'])
  const [activeColorIndex, setActiveColorIndex] = useState<number>(0)
  const [value, setValue] = useState(90)
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [sampleText, setSampleText] = useState('Erm, what the sigma?')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const editableRef = useRef<HTMLDivElement>(null)

  // This effect syncs the state to the DOM, but prevents cursor jumps.
  // It only changes the div's content if it differs from the state,
  // which won't happen during normal typing.
  useEffect(() => {
    if (editableRef.current && editableRef.current.textContent !== sampleText) {
      editableRef.current.textContent = sampleText
    }
  }, [sampleText])

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // --- GRADIENT AND CODE STRING GENERATION ---
  const gradientValue =
    type === 'linear'
      ? `linear-gradient(${value}deg, ${colors.join(', ')})`
      : `radial-gradient(circle at center, ${colors.join(', ')})`

  const backgroundReactCode = `style={{
  background: '${gradientValue}',
}}`

  const backgroundCssCode = `.gradient-background {
  background: ${gradientValue};
}`

  const textReactCode = `style={{
  backgroundImage: '${gradientValue}',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}}`

  const textCssCode = `.gradient-text {
  background-image: ${gradientValue};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-[10vh]">
      {/* --- COLOR STOPS --- */}
      <div className="flex max-w-md flex-wrap items-center justify-center gap-2">
        {colors.map((color, index) => (
          <div key={index} className="group relative flex items-center">
            <button
              onClick={() => setActiveColorIndex(index)}
              className="h-10 w-10 rounded-lg border border-[var(--border-primary)]"
              style={{ backgroundColor: color }}
            />
            {colors.length > 2 && (
              <button
                onClick={() => {
                  setColors(colors.filter((_, i) => i !== index))
                  if (index === activeColorIndex) setActiveColorIndex(0)
                }}
                className="cursor-pointer absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
        {colors.length < 9 && (
          <button
            onClick={() => {
              setColors([...colors, '#ffffff'])
              setActiveColorIndex(colors.length)
            }}
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-primary)]"
          >
            <PlusIcon className="h-5 w-5 text-[var(--text-secondary)]" />
          </button>
        )}
      </div>

      {/* --- COLOR PICKER AND INPUTS --- */}
      <div className="z-10 flex flex-col gap-2">
        <HexColorPicker
          color={colors[activeColorIndex]}
          onChange={(newColor) => {
            const newColors = [...colors]
            newColors[activeColorIndex] = newColor
            setColors(newColors)
          }}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-secondary)]">HEX</label>
          <input
            type="text"
            value={colors[activeColorIndex]}
            onChange={(e) => {
              const newValue = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value
              if (/^#?[0-9A-Fa-f]{0,6}$/.test(newValue)) {
                const newColors = [...colors]
                newColors[activeColorIndex] = newValue
                setColors(newColors)
              }
            }}
            onBlur={(e) => {
              const newColors = [...colors]
              newColors[activeColorIndex] = `#${e.target.value.replace('#', '').padEnd(6, '0')}`
              setColors(newColors)
            }}
            className={`w-full rounded-md border border-[var(--border-primary)] bg-transparent py-1 text-center font-semibold text-[var(--text-primary)]`}
            placeholder="HEX"
          />
        </div>
        <div className="flex gap-4">
          {[
            { label: 'R', index: 0 },
            { label: 'G', index: 1 },
            { label: 'B', index: 2 },
          ].map(({ label, index }) => (
            <div className="flex flex-col gap-1" key={label}>
              <label className="text-xs text-[var(--text-secondary)]">{label}</label>
              <input
                type="number"
                value={hexToRgb(colors[activeColorIndex])[index]}
                onChange={(e) => {
                  const rgb = hexToRgb(colors[activeColorIndex])
                  rgb[index] = Number(e.target.value)
                  const newColors = [...colors]
                  newColors[activeColorIndex] = rgbToHex(rgb[0], rgb[1], rgb[2])
                  setColors(newColors)
                }}
                className={clsx(
                  'w-14 rounded-md border border-[var(--border-primary)] bg-transparent py-1 text-center font-semibold text-[var(--text-primary)]',
                  numberInputClass
                )}
                min="0"
                max="255"
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- GRADIENT CONTROLS --- */}
      <div className="flex items-center">
        <CircularSlider
          handle1={{ value: value, onChange: (v) => setValue(Math.ceil(v)) }}
          arcColor={colors[activeColorIndex]}
          arcBackgroundColor={colors[activeColorIndex]}
          angleType={{ direction: 'cw', axis: '+y' }}
          minValue={0}
          maxValue={360}
          size={80}
          trackWidth={3}
          disabled={type === 'radial'}
        />
        <input
          value={value}
          type="number"
          disabled={type === 'radial'}
          onChange={(e) => setValue(Math.max(0, Math.min(Number(e.target.value), 360)))}
          className={clsx(
            'w-14 rounded-md border bg-transparent py-1 text-center font-semibold',
            type === 'radial'
              ? 'border-[var(--border-secondary)] text-[var(--border-secondary)]'
              : 'border-[var(--border-primary)] text-[var(--text-primary)]',
            numberInputClass
          )}
          min={0}
          max={360}
        />
      </div>
      <div className="flex rounded-lg border border-[var(--border-primary)] p-1">
        {(['linear', 'radial'] as const).map((gradType) => (
          <button
            key={gradType}
            onClick={() => setType(gradType)}
            className={clsx('rounded-md px-4 py-1 text-sm capitalize', {
              'bg-[var(--hover-bg)] text-[var(--text-primary)]': type === gradType,
              'cursor-pointer bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]':
                type !== gradType,
            })}
          >
            {gradType}
          </button>
        ))}
      </div>

      {/* --- MAIN DISPLAY & CODE SNIPPETS --- */}
      <div className="mt-4 flex w-full max-w-md flex-col gap-4">
        <div className="flex w-full justify-center">
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={(e) => setSampleText(e.currentTarget.textContent ?? '')}
            spellCheck="false"
            data-placeholder="Type here..."
            className="w-auto max-w-full mx-auto border-none bg-transparent text-center text-3xl font-bold outline-none"
            style={{
              backgroundImage: gradientValue,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />
        </div>

        <div className="h-32 w-full rounded-xl" style={{ background: gradientValue }} />

        {/* --- NESTED TABS FOR CODE --- */}
        <TabGroup>
          <TabList className="flex gap-2 rounded-lg border border-[var(--border-primary)] p-1">
            <Tab className="cursor-pointer data-[selected]:cursor-default flex-1 rounded-md py-1 text-sm text-[var(--text-secondary)] focus:outline-none data-[selected]:bg-[var(--hover-bg)] data-[selected]:text-[var(--text-primary)] data-[hover]:text-[var(--text-primary)]">
              Background
            </Tab>
            <Tab className="cursor-pointer data-[selected]:cursor-default flex-1 rounded-md py-1 text-sm text-[var(--text-secondary)] focus:outline-none data-[selected]:bg-[var(--hover-bg)] data-[selected]:text-[var(--text-primary)] data-[hover]:text-[var(--text-primary)]">
              Text
            </Tab>
          </TabList>
          <TabPanels className="mt-2">
            {[
              { type: 'Background', reactCode: backgroundReactCode, cssCode: backgroundCssCode },
              { type: 'Text', reactCode: textReactCode, cssCode: textCssCode },
            ].map((panel, panelIdx) => (
              <TabPanel key={panel.type}>
                <TabGroup>
                  <TabList className="mb-2 flex gap-4 border-b border-[var(--border-secondary)]">
                    <Tab className="cursor-pointer data-[selected]:cursor-default border-b-2 border-transparent px-2 py-1 text-sm text-[var(--text-secondary)] focus:outline-none data-[selected]:border-[var(--selected-tab-border)] data-[selected]:text-[var(--text-primary)]">
                      React
                    </Tab>
                    <Tab className="cursor-pointer data-[selected]:cursor-default border-b-2 border-transparent px-2 py-1 text-sm text-[var(--text-secondary)] focus:outline-none data-[selected]:border-[var(--selected-tab-border)] data-[selected]:text-[var(--text-primary)]">
                      CSS
                    </Tab>
                  </TabList>
                  <TabPanels className="mt-3">
                    <TabPanel>
                      <div className="relative">
                        <button
                          onClick={() => copyToClipboard(panel.reactCode, panelIdx * 2)}
                          className="cursor-pointer absolute right-2 top-2 rounded-lg p-2 hover:bg-[var(--hover-bg)]"
                        >
                          {copiedIndex === panelIdx * 2 ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                          )}
                        </button>
                        <pre className="overflow-x-auto rounded-lg bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-primary)]">
                          {panel.reactCode}
                        </pre>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div className="relative">
                        <button
                          onClick={() => copyToClipboard(panel.cssCode, panelIdx * 2 + 1)}
                          className="absolute right-2 top-2 rounded-lg p-2 hover:bg-[var(--hover-bg)]"
                        >
                          {copiedIndex === panelIdx * 2 + 1 ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5 text-[var(--text-secondary)]" />
                          )}
                        </button>
                        <pre className="overflow-x-auto rounded-lg bg-[var(--bg-secondary)] p-4 text-sm text-[var(--text-primary)]">
                          {panel.cssCode}
                        </pre>
                      </div>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
      <br />
    </div>
  )
}
