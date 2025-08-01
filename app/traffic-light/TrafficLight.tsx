export type LightState = 'stop' | 'readyGo' | 'go' | 'readyStop'

export default function TrafficLight({ state }: { state: LightState }) {
  return (
    <div className="w-24 bg-gray-800 p-2 gap-4 flex flex-col">
      <div
        className={`${state === 'stop' || state == 'readyGo' ? 'bg-red-500' : 'bg-gray-500'} rounded-full h-20`}
      ></div>
      <div
        className={`${state === 'readyGo' || state == 'readyStop' ? 'bg-yellow-500' : 'bg-gray-500'} rounded-full h-20`}
      ></div>
      <div className={`${state === 'go' ? 'bg-green-500' : 'bg-gray-500'} rounded-full h-20`}></div>
    </div>
  )
}
