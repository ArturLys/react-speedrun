import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix } from '@fortawesome/free-solid-svg-icons'

const diceIcons = [faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix]

export default function DicePage({ value, shake }: { value: number; shake?: boolean }) {
  return <FontAwesomeIcon icon={diceIcons[value - 1]} className={`text-6xl`} shake={shake} />
}
