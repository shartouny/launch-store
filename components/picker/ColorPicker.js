import ColorButton from '../button/ColorButton'

const ColorPicker = ({ colors, colorSelected, containerStyle, onItemPicked }) => {
  // METHODS
  const onColorPicked = (position) => onItemPicked(colors[position])

  return <div className={`flex flex-row flex-wrap  ${containerStyle}`}>{colors?.map((item, index) => item.hex_code && <ColorButton isPicked={colorSelected == item.id} key={item.id} index={index} color={item.hex_code} onClick={() => onColorPicked(index)}></ColorButton>)}</div>
}

export default ColorPicker
