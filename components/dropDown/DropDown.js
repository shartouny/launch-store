const DropDown = ({ className, names, placeholder, value, handleSelectorChange, style, name }) => {
  return (
    <div>
      <select style={style} name={name} className={className} value={value} onChange={handleSelectorChange}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {names.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DropDown
