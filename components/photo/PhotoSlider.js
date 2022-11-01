import { useEffect, useRef, useState } from 'react'
import InnerImageZoom from 'react-inner-image-zoom'

const PhotoSlider = ({ data, colorPicked }) => {
  const itemRef = useRef([])
  const imgContainerRef = useRef()
  const lastPosition = useRef()

  const [pic, setPic] = useState({
    animate: false,
    position: 0
  })

  useEffect(() => {
    if (colorPicked) {
      const position = data.findIndex((item) => item.color_id == colorPicked)
      if (position && position >= 0) {
        setPic({
          animate: true,
          position: position
        })
        smoothTransition(position)
      }
    }
  }, [colorPicked, data])

  const onItemPressed = (position) => setPic({ animate: true, position })

  const smoothTransition = (position) => {
    const item = document.getElementById(`item_${position}`)
    if (lastPosition?.current) {
      if (lastPosition.current < item.offsetLeft)
        imgContainerRef.current.scrollBy({
          left: item.offsetLeft,
          behavior: 'smooth'
        })
      else {
        imgContainerRef.current.scrollBy({
          left: -item.offsetWidth - 10,
          behavior: 'smooth'
        })
      }

      lastPosition.current = item?.offsetLeft
    } else if (item) {
      imgContainerRef.current.scrollLeft += item.offsetLeft
      lastPosition.current = item?.offsetLeft
    }
  }

  const onAnimationEnd = (position) => setPic({ animate: false, position })
  const [zoomIn, setZoomIn] = useState(false)

  return (
    <>
      <div className={'flex flex-col w-full md:w-full lg:w-photo-picker-lg xl:w-photo-picker-xl'}>
        <div className={'flex justify-center'}>{data && data?.length != 0 ? <InnerImageZoom className={`${zoomIn ? 'w-full ' : 'w-3/5'}`} fullscreenOnMobile={true} src={data[pic.position]?.thumb} zoomSrc={data[pic.position]?.img} zoomPreload={false} afterZoomIn={() => setZoomIn(true)} afterZoomOut={() => setZoomIn(false)} /> : <img alt={'img'} className="w-full" src="/icons/image-placeholder.svg" />}</div>
        <div className="flex flex-col m-auto w-full h-full p-auto photo-picker-scroll-bar">
          <div ref={imgContainerRef} className={`flex  ${data?.length > 4 && 'overflow-x-scroll'}  ${data?.length <= 4 && 'w-full justify-center'} px-0.5 pt-2 lg:pt-6 pb-2 photo-picker-scroll-bar`}>
            <div className="flex flex-nowrap">
              {data?.map((item, position) => {
                return (
                  <div
                    id={`item_${position}`}
                    key={item?.id}
                    ref={(ref) => (itemRef.current[position] = ref)}
                    className={`
                        cursor-pointer transition duration-500 transform  hover:scale-105 ${pic.position == position && pic.animate && 'animate-pillow'}
                        w-photo-picker-item-phone h-photo-picker-item-phone
                        sm:mr-2 sm:h-photo-picker-item-sm sm:w-photo-picker-item-sm
                        md:w-photo-picker-item-md md:h-photo-picker-item-md md:mr-4
                        lg:w-photo-picker-item-md lg:h-photo-picker-item-md lg:x-photo-picker-item-md
                        xl:w-photo-picker-item-lg xl:h-photo-picker-item-lg xl:mr-6
                        rounded-lg ${pic.position == position && 'border border-black '} mr-3`}
                    onClick={() => {
                      onItemPressed(position)
                    }}
                    onAnimationEnd={() => {
                      onAnimationEnd(position)
                    }}>
                    <img alt={'img'} className={'object-cover w-full h-full rounded-lg'} src={item.thumb} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PhotoSlider
