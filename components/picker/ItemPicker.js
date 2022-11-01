import { useState } from 'react'

const ItemPicker = ({ data, onItemSelected, value, truncate, containerStyle }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={'w-full'}>
      <div className={`flex-col border border-solid border-black border-opacity-40 rounded-lg h-12 items-center items-center relative flex cursor-pointer `} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex-col items-center py-2 w-full h-full">
          <div className={`group h-full w-full relative cursor-pointer`}>
            <p className={`h-full pr-4 pt-1 pl-2 text-left ${truncate ? 'truncate' : ' w-full'}`}>{value?.name}</p>
            {/*{(!isOpen && value?.name.length > 8) && <span*/}
            {/*  className="opacity-0 min-w-full  break-normal group-hover:opacity-90 transition duration-200 absolute -top-10 bg-black text-white font-semibold text-xs px-2 py-2 rounded-sm ">{value.name}</span>}*/}
          </div>
          <img src="/icons/arrow-up.svg" className={`absolute my-auto right-3 w-3 h-3 top-5 ${isOpen ? '' : 'transform rotate-180'}  transition duration-200 ease-linear`} alt="arrow-icon" />
        </div>
        <div className={` ${isOpen ? 'visible' : 'invisible'}  mt-2 h-auto bg-white border-solid border rounded-md flex flex-col items-start w-full `}>
          {data.map((item) => (
            <p className={`ext-center break-words bg-white-50  pl-2 py-2 pr-5 w-full hover:text-white hover:bg-black transition duration-200 ease-out  ${containerStyle}`} onClick={() => onItemSelected(item)} key={item.id}>
              {item.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
export default ItemPicker
