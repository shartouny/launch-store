import React, { useEffect, useRef, useState } from 'react'

import Icon from '../icons/icon'

const NestedDropDown = ({ className, selectedIcon, categoryId, label, options, onParentSelected, onChildSelected }) => {
  // STATE
  const [isOpen, setIsOpen] = useState(false)
  const [openChild, setopenChild] = useState(false)
  const [openChildIndex, setopenChildIndex] = useState(-1)
  const [mouseOverIndex, setmouseOverIndex] = useState(-1)

  const ref = useRef()

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isOpen && ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false)
        setopenChild(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [isOpen])

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
  const onParentSelectHandler = (option, index) => {
    if (!option.categories) {
      onParentSelected(option.id, option.name)
      setopenChild(false)
      setIsOpen(false)
    } else {
      setopenChildIndex(index)
      setopenChild((prev) => !prev)
    }
  }

  /**
   *
   * @param {string} categoryId
   * @param {string} categoryName
   */
  const onChildSelectHandler = (categoryId, categoryName) => {
    onChildSelected(categoryId, categoryName)
    setIsOpen(false)
    setopenChild(false)
  }

  return (
    <div ref={ref}>
      {/* WEB */}
      <div className="hidden lg:block relative lg:w-60 md:w-30">
        <button className={`flex justify-between items-center    py-4 lg:py-2 text-xs font-semibold lg:text-base ${className} rounded-md focus:outline-none  text-white`} onClick={onClickHandler}>
          <span className="hidden md:inline-block mr-4">{label}</span>
          <div className="w-6 lg:w-auto">
            <Icon selectedIcon={selectedIcon} color="#fff" />
          </div>
        </button>
        {isOpen && (
          <div className="absolute w-60 h-auto text-xs bg-white rounded-sm border border-solid">
            {options?.map((option, index) => (
              <span key={index}>
                {openChild && openChildIndex == index && option.categories ? (
                  <div className="absolute w-36 bg-white rounded-sm border border-solid" style={{ right: '-145px' }}>
                    {option.categories?.map((optionChild, indexChild) =>
                      optionChild.isEmpty ? (
                        ''
                      ) : (
                        <span key={indexChild}>
                          <div onClick={() => onChildSelectHandler(optionChild.id, optionChild.name)}>
                            <div style={{ height: '40px' }} className=" flex justify-start items-center p-2 pb-2 pl-5 w-full font-medium text-primary hover:text-white hover:bg-primary border-b border-gray-300 cursor-pointer">
                              {optionChild.name}
                            </div>
                          </div>
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  ''
                )}
                {option.isEmpty ? (
                  ''
                ) : (
                  <div
                    onClick={() => onParentSelectHandler(option, index)}
                    onMouseOver={() => {
                      setmouseOverIndex(index)
                    }}
                    onMouseLeave={() => {
                      setmouseOverIndex(-1)
                    }}
                    className={`hover:bg-primary hover:text-white flex justify-start items-center cursor-pointer w-full p-2 pb-2 border-b  border-gray-300 text-primary ${option.id == categoryId ? 'bg-primary text-white' : ''}`}>
                    <div className="w-12" align="center">
                      <Icon selectedIcon={option.name} color={`${option.id == categoryId || mouseOverIndex == index ? '#fff' : 'var(--theme-primary)'}`} />
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div className={`font-medium ${option.id == categoryId || mouseOverIndex == index ? 'text-white' : ''} `}>{option.name}</div>
                      {option.categories ? (
                        <div className="mr-2">
                          <Icon selectedIcon="RightCaret" color={mouseOverIndex == index ? '#fff' : 'var(--theme-primary)'} />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE */}
      <div className=" lg:hidden">
        <button className={`flex  justify-center w-full items-center text-xs font-bold  ${className} rounded-md    text-white`} onClick={onClickHandler}>
          <span className="mx-2">{label}</span>
          <div>
            <Icon selectedIcon={selectedIcon} color="#fff" />
          </div>
        </button>
        {isOpen && (
          <div className="relative right-0 z-20 w-full h-auto text-xs bg-white rounded-sm border border-solid">
            {options?.map((option, index) => (
              <span key={index}>
                {option.isEmpty ? (
                  ''
                ) : (
                  <div onClick={() => onParentSelectHandler(option, index)} className={`flex justify-start items-center   p-2 pb-2 border-b  border-gray-300 text-primary `}>
                    <div className="w-12" align="center">
                      <Icon selectedIcon={option.name} color={'var(--theme-primary)'} />
                    </div>
                    <div className="flex justify-between w-full">
                      <div className="font-medium">{option.name}</div>
                      {option.categories ? (
                        <div>
                          <Icon selectedIcon="UpCaret" color={'var(--theme-primary)'} />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                )}
                {openChild && openChildIndex == index && option.categories ? (
                  <div className="bg-gray-100">
                    {option.categories?.map((optionChild, indexChild) =>
                      optionChild.isEmpty ? (
                        ''
                      ) : (
                        <span key={indexChild}>
                          <div onClick={() => onChildSelectHandler(optionChild.id, optionChild.name)}>
                            <div style={{ height: '40px' }} className=" flex justify-center items-center font-medium text-primary border-b border-gray-300">
                              {optionChild.name}
                            </div>
                          </div>
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  ''
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NestedDropDown
