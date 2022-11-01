import { useState } from 'react'

const CounterPicker = ({ init, className, onCount }) => {
  let [count, setCount] = useState(init ? init : 1)
  const minusPressed = () => {
    if (count > 1) setCount(--count)
    if (onCount) onCount(count)
  }
  const plusPressed = () => {
    setCount(++count)
    if (onCount) onCount(count)
  }
  return (
    <div className={`flex justify-between border border-black rounded-md py-1 px-2 w-28 ${className}`}>
      <button className="focus:outline-none" onClick={minusPressed}>
        -
      </button>
      <p> {count} </p>
      <button className="focus:outline-none" onClick={plusPressed}>
        +
      </button>
    </div>
  )
}

export default CounterPicker
