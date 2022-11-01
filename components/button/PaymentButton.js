const PaymentButton = ({ title, leftDrawable, backgroundClassName, titleClassName, onClick, isActive, isButtonClicked }) => {
  return (
    <div
      onClick={() => {
        if (isActive && !isButtonClicked) onClick()
      }}
      className={`flex border-1 max-h-12 bg-black rounded-md items-center justify-center ${isButtonClicked ? 'cursor-wait' : isActive ? 'cursor-pointer' : 'cursor-not-allowed'}  ${backgroundClassName}`}>
      {leftDrawable && <div className={'mx-2 transition duration-500 ease-in-out transform origin-top-left hover:-rotate-12'}>{leftDrawable}</div>}
      <span className={`text-black ${titleClassName} `}>{title}</span>
    </div>
  )
}

export default PaymentButton
