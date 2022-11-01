const RoundedButton = ({ label, selected = false, className, setSubSelected }) => {
  return (
    <div className={`relative ${className} fit-content`}>
      <button className={`border border-solid border-black ${selected ? 'bg-black text-white' : ''} rounded-2xl focus:outline-none font-semibold px-5 py-1 text-xs`} onClick={setSubSelected}>
        {label}
      </button>
    </div>
  )
}

export default RoundedButton
