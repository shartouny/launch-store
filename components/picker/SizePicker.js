const SizePicker = ({ data, onItemPressed, itemSelected }) => {
  const handleItemPressed = (item) => onItemPressed(item)

  return (
    <div className="flex items-center">
      {data?.map((item) => (
        <div className={`px-9 md:px-7 cursor-pointer border border-opacity-40 border-black text-center break-words bg-white-50 min-w-11  py-1.5 mr-3 hover:text-white hover:bg-black transition duration-200 ease-out rounded-md mr-1 ${item.id == itemSelected ? `text-white bg-black` : ``}`} onClick={() => handleItemPressed(item)} key={item.id}>
          {item.name}
        </div>
      ))}
    </div>
  )
}
export default SizePicker
