import Icon from '../icons/icon'

const Search = ({ inputClassName, placeholder, value, autocompleteValues, onSearchPressed, onHintsChoose, onChangeHandler, className }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchPressed()
    }
  }

  return (
    <div className={`${className}`}>
      <div className="w-full autocomplete">
        <div className={`flex  items-center`}>
          <input value={value} onKeyDown={handleKeyDown} type="text" className={`h-10 w-full text-xs lg:text-md focus:outline-none ${inputClassName} py-2 px-2 rounded-md`} onChange={(e) => onChangeHandler(e.target.value)} placeholder={placeholder} />
          <div onClick={onSearchPressed} className="absolute right-2 p-2 cursor-pointer">
            <Icon selectedIcon="Search" color={'#000'} />
          </div>
        </div>
        <div className={`autocomplete-items  w-full cursor-pointer ${autocompleteValues && autocompleteValues.length > 0 ? 'max-h-48' : '0'}`}>
          {autocompleteValues?.map((item, key) => (
            <span className={`flex flex-col p-2  bg-white md:flex-row content-center justify-center sm:justify-start cursor-pointer`} key={key} onClick={() => onHintsChoose(item)}>
              <span className={`text-left text-sm md:text-base`}>{item.name}</span>
              <p className={'text-left'}>
                <span className={`text-gray-500 ml-1 text-xs  text-left`}>({item.categoryDisplayName})</span>
              </p>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Search
