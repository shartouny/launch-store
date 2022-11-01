import Icon from '../icons/icon'

const LoadingButton = ({ label, selectedIcon, className, onClick, isLoading, minWidth, disable }) => {
  return (
    <button disabled={isLoading || disable ? true : false} className={`flex justify-center items-center ${disable ? 'cursor-not-allowed' : ''} ${isLoading ? 'cursor-wait' : 'cursor-pointer'} ${className} rounded-md focus:outline-none shadow-md  text-xs font-semibold px-4 py-4 lg:py-2 lg:text-base `} style={{ minWidth: minWidth }} onClick={onClick}>
      {!isLoading && (
        <div className="inline-block">
          {selectedIcon && (
            <div className={`inline-block ${label && label != '' ? 'px-1' : ''}`}>
              <Icon selectedIcon={selectedIcon} color={'#fff'} />
            </div>
          )}
          {label && label != '' ? <span className={`${selectedIcon ? 'px-1' : ''}`}>{label}</span> : ''}
        </div>
      )}
      {isLoading && <img alt={'loader-white.svg'} className="h-6 animate-spin" src="/icons/loader-white.svg" />}
    </button>
  )
}

export default LoadingButton
