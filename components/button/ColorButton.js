const ColorButton = ({ isPicked, color, onClick }) => {
  return (
    <div
      style={{
        backgroundColor: 'transparent',
        border: '2px solid ',
        borderColor: isPicked ? (color.toLowerCase() == '#ffffff' ? '#D5D5D5' : color) : 'transparent'
      }}
      className={`rounded-full w-10 h-10 flex items-center justify-center cursor-pointer mx-1`}
      onClick={onClick}>
      <div style={{ background: color.toLowerCase() == '#ffffff' ? '#D5D5D5' : color }} className="flex items-center w-8 h-8 rounded-full justify-center..."></div>
    </div>
  )
}

export default ColorButton
