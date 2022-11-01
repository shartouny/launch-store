import { useEffect } from 'react'

const Popup = ({ message, visible, container, duration = 2000, onDismiss }) => {
  useEffect(() => {
    if (visible && duration) {
      setTimeout(() => {
        if (onDismiss) onDismiss()
      }, duration)
    }
  }, [message, visible, duration, onDismiss])

  return visible ? (
    <div className={`fixed top-24  sm:top-10 z-50 left-1/2 transform -translate-x-1/2 ${container}`}>
      <div className="flex items-center py-1 px-4 font-medium text-white bg-gray-700 rounded-md border border-solid">
        <p className={`fit-content text-xs sm:text-base`}>{message}</p>
        <svg xmlns="http://www.w3.org/2000/svg" onClick={onDismiss} className="ml-2 w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  ) : null
}

export default Popup
