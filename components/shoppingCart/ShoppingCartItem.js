import React from 'react'

import CounterPicker from '../picker/CounterPicker'

export default function ShoppingCartItem({ active, onDeleteClicked, data, onCartChanged }) {
  return (
    <>
      {/* WEB */}
      <div className="container">
        <div className={`lg:grid ${active ? 'grid-cols-7' : 'grid-cols-6'} border-b border-gray-light border-solid md:mt-5 hidden pb-5`}>
          <div className="">
            <div className={`${data?.variant[0]?.image ? '' : 'bg-gray-light'} ${!active ? 'px-4' : 'px-8'} rounded-md relative`}>
              {active && (
                <span className="flex absolute top-0 left-5 justify-center items-center p-3 w-5 h-5 text-white bg-black rounded-full cursor-pointer" onClick={onDeleteClicked}>
                  &#10005;
                </span>
              )}
              <img alt={'img'} src={`${data?.variant[0]?.image ? data?.variant[0]?.image : '/icons/image-placeholder.svg'}`} className="" />
            </div>
          </div>
          <div className={`${active ? 'col-span-3' : 'pl-4 col-span-3 '} `}>
            <p className="text-lg font-medium">{data?.variant[0]?.name}</p>

            {data?.options?.map((option, index) => {
              if (option.type.toLowerCase() == 'size')
                return (
                  <p key={index} className="md:mt-1 text-gray-500 fit-content">
                    {option.values}
                  </p>
                )
              else if (option.type.toLowerCase() == 'scent')
                return (
                  <p key={index} className="md:mt-1 text-gray-500 fit-content">
                    {option.values}
                  </p>
                )
              else if (option.type.toLowerCase() == 'depth')
                return (
                  <p key={index} className="px-4 md:mt-2 text-sm text-center text-gray-500 bg-gray-transparent rounded-xl border border-gray-transparent border-solid shadow-md bg-grey-200 fit-content">
                    {option.values}
                  </p>
                )
              else if (option.type.toLowerCase() == 'color')
                return (
                  <p key={index} className="flex items-center md:mt-2">
                    {/* <span className="inline-block mr-2 w-3 h-3 rounded-full border border-black"
                      style={{background: option?.hex_code}}></span> */}
                    <span className="text-gray-500">{option?.values}</span>
                  </p>
                )
              else
                return (
                  <div key={index} className={'flex flex-row'}>
                    <p>{option.values}</p>
                  </div>
                )
            })}
          </div>
          {active && <p className="text-center">${parseFloat(data?.variant[0]?.price).toFixed(2)}</p>}
          {active ? (
            <div className="mx-auto">
              <CounterPicker
                init={data?.quantity}
                onCount={(count) => {
                  onCartChanged(count)
                }}
              />
            </div>
          ) : (
            <p className="col-span-1 text-center">{data?.quantity}</p>
          )}
          <p className=" text-right">${(data?.variant[0]?.price * data?.quantity).toFixed(2)}</p>
        </div>
      </div>
      {/* MOBILE */}
      <div className="flex md:hidden relative gap-3 items-center px-1 pb-8 mb-5 w-full border-b-2 border-gray-light border-solid">
        <div className={` ${data?.variant[0]?.image ? '' : 'bg-gray-light'} flex justify-center items-center w-20 sm:w-1/3 h-20 rounded-md relative`}>
          {active && (
            <span className="flex absolute top-0 left-0 justify-center items-center p-2 w-5 h-5 text-white bg-black rounded-full cursor-pointer" onClick={onDeleteClicked}>
              &#10005;
            </span>
          )}
          <img alt={'img'} src={`${data?.variant[0]?.image ? data?.variant[0]?.image : '/icons/image-placeholder.svg'}`} className="sm:w-25 sm:h-25" />
        </div>
        <div className="w-full">
          <div className={`grid ${active ? 'grid-cols-2' : 'grid-cols-3'} justify-between justify-between items-center md:mb-2.5 bg`}>
            <p className="text-sm font-semibold">{data?.variant[0]?.name}</p>
            {!active && <p className="text-center">{data?.quantity}</p>}
            <p className="text-lg font-semibold text-right">${parseFloat(data?.variant[0]?.price).toFixed(2)}</p>
            <p className="text-lg font-semibold">${parseFloat(data?.variant[0]?.price).toFixed(2)}</p>
          </div>
          <div className="flex sm:justify-between items-end sm:items-center sm:mt-5 md:mt-5 lg:mt-5">
            <div className="w-full">
              {data?.options?.map((option, index) => {
                if (option.type.toLowerCase() == 'size')
                  return (
                    <p key={index} className="md:mt-1 text-gray-500">
                      {option.values}
                    </p>
                  )
                else if (option.type.toLowerCase() == 'scent')
                  return (
                    <p key={index} className="md:mt-1 text-sm text-center text-gray-500 fit-content">
                      {option.values}
                    </p>
                  )
                else if (option.type.toLowerCase() == 'depth')
                  return (
                    <p key={index} className="text-sm text-center text-gray-500 fit-content">
                      {option.values}
                    </p>
                  )
                else if (option.type.toLowerCase() == 'color')
                  return (
                    <p key={index} className="flex items-center md:mt-2">
                      {/* <span className="inline-block mr-2 w-3 h-3 rounded-full border border-black"
                      style={{background: option?.hex_code}}></span> */}
                      <span className="text-gray-500">{option.values}</span>
                    </p>
                  )
                else
                  return (
                    <p key={index} className="mt-1 text-sm">
                      {option.values}
                    </p>
                  )
              })}
            </div>
            <div className="">
              {active && (
                <CounterPicker
                  init={data?.quantity}
                  onCount={(count) => {
                    onCartChanged(count)
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
