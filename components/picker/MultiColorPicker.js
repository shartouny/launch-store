import Input from '@components/input/Input'
import { toRgb } from '@utils/helper'
import { useState } from 'react'
import { AlphaPicker, HuePicker } from 'react-color'

const MultiColorPicker = ({ primaryColor, secondaryColor, handlePrimaryColorChange, handleSecondaryColorChange }) => {
  const [selectedColor, setSelectedColor] = useState('primary')

  const onChangeHueChange = (e) => {
    if (selectedColor == 'primary') {
      handlePrimaryColorChange(e)
    } else {
      handleSecondaryColorChange(e)
    }
  }
  const onChangeAlphaChange = (e) => {
    if (selectedColor == 'primary') {
      handlePrimaryColorChange(e)
    } else {
      handleSecondaryColorChange(e)
    }
  }
  const onChangeColor = (e) => {
    let { value } = e.target
    const isHex = toRgb(value)

    if (selectedColor == 'primary') {
      if (value) {
        handlePrimaryColorChange(() => {
          return { rgb: isHex.rgb, hex: value }
        })
      } else
        handlePrimaryColorChange(() => {
          return { rgb: isHex.rgb, hex: value }
        })
    } else {
      if (value) {
        handleSecondaryColorChange(() => {
          return { rgb: isHex.rgb, hex: value }
        })
      } else
        handleSecondaryColorChange(() => {
          return { rgb: isHex.rgb, hex: value }
        })
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex">
          <div
            style={{
              border: selectedColor == 'secondary' ? '1px solid' : ''
            }}
            className={`rounded-full w-8 h-8 flex items-center justify-center cursor-pointer mx-1`}
            onClick={() => setSelectedColor('secondary')}>
            <div style={{ backgroundColor: `rgba(${secondaryColor?.rgb?.r},${secondaryColor?.rgb?.g},${secondaryColor?.rgb?.b},${secondaryColor?.rgb?.a})` }} className="flex justify-center items-center w-6 h-6 rounded-full"></div>
          </div>
          <div
            style={{
              border: selectedColor == 'primary' ? '1px solid' : ''
            }}
            className={`rounded-full w-8 h-8 flex items-center justify-center cursor-pointer mr-1`}
            onClick={() => setSelectedColor('primary')}>
            <div style={{ backgroundColor: `rgba(${primaryColor?.rgb?.r},${primaryColor?.rgb?.g},${primaryColor?.rgb?.b},${primaryColor?.rgb?.a})` }} className="flex justify-center items-center w-6 h-6 rounded-full"></div>
          </div>
        </div>
        <div className="mx-2 w-full sm:w-1/2">
          <HuePicker className="my-2" color={selectedColor == 'primary' ? primaryColor.rgb : secondaryColor.rgb} onChange={onChangeHueChange} onChangeComplete={onChangeHueChange} />
          <AlphaPicker className="my-2" color={selectedColor == 'primary' ? primaryColor.rgb : secondaryColor.rgb} onChange={onChangeAlphaChange} onChangeComplete={onChangeAlphaChange} />
        </div>
        <div>
          <Input placeholder="Hex Color" onChangeHandler={onChangeColor} value={selectedColor == 'primary' ? primaryColor.hex : secondaryColor.hex} className={`text-xs  focus:outline-none border-colorC4C4C4 py-1 text-center w-28 border  rounded-lg `} />
        </div>
      </div>
    </>
  )
}

export default MultiColorPicker
