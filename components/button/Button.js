import Icon from '../icons/icon'

const Button = ({ id, type, label, selectedIcon, className, isSelected, setSelected, click }) => {
  const setClasses = () => {
    let style = ''

    if (type === 'primary') {
      style = 'bg-primary text-white'
    } else if (type === 'secondary') {
      style = 'bg-white text-primary'
    }

    if (type === 'secondary' && isSelected) {
      style = 'bg-primary text-white'
    }

    return style
  }

  return (
    <button className={`flex justify-between items-center shadow-md px-4 py-4 text-xs font-semibold lg:py-2 lg:text-base ${className} rounded-md focus:outline-none ${setClasses()}`} onClick={type === 'secondary' ? () => setSelected(id) : !!click ? () => click() : null}>
      {selectedIcon && (
        <div className={`${type === 'secondary' ? 'w-6 lg:w-auto' : ''}`}>
          <Icon selectedIcon={selectedIcon} color={!isSelected && type === 'secondary' ? '#000000' : '#fff'} />
        </div>
      )}
      {label == '' ? '' : <span className={`${selectedIcon ? 'md:inline-block lg:ml-4' : 'mr-auto'}`}>{label}</span>}
    </button>
  )
}

export default Button
