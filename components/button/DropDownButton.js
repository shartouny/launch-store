import React, { useEffect, useRef, useState } from 'react'

import Icon from '../icons/icon'

const DropDownButton = ({ className, value, selectedIcon, label, options, onValueSelected }) => {
  // STATE
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef()
  // METHODS
  /**
   *
   * @param {Event} e
   */
  const onClickHandler = (e) => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  /**
   *
   * @param {string} option
   */
  const onSelectHandler = (option) => {
    onValueSelected(option)
    setIsOpen(false)
  }

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [isOpen])

  return (
    <div ref={ref}>
      {/* WEB */}
      <div className="hidden lg:block">
        <button className={`flex justify-between items-center   px-4 py-4 lg:py-2 text-xs font-semibold lg:text-base ${className} rounded-md focus:outline-none bg-primary text-white`} onClick={onClickHandler}>
          <div className="w-6 lg:w-auto">
            <Icon selectedIcon={selectedIcon} color="#fff" />
          </div>
          <span className="hidden lg:inline-block ml-4">{label}</span>
        </button>
        {isOpen && (
          <div className="absolute z-50 w-36 h-auto text-xs bg-white rounded-sm border border-solid">
            {options?.map((option, index) => (
              <p key={index} onClick={() => onSelectHandler(index)} className={`hover:bg-primary hover:text-white cursor-pointer w-full p-2 pb-2 border-b border-solid border-primary ${index == value ? 'bg-primary text-white' : ''}`}>
                {option}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE */}
      <div className="lg:hidden mr-2 ml-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <Icon selectedIcon={selectedIcon} color="var(--theme-primary)" />
        {isOpen && (
          <div className="absolute right-10 w-36 h-auto text-xs bg-white rounded-sm border border-solid">
            {options?.map((option, index) => (
              <p key={index} onClick={() => onSelectHandler(index)} className={`hover:bg-primary hover:text-white cursor-pointer w-full p-2 pb-2 border-b border-solid border-primary ${index == value ? 'bg-primary text-white' : ''}`}>
                {option}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DropDownButton
