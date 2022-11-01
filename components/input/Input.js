const Input = ({ onkeydown, placeholder, onBlur, onChangeHandler, style, className, value, type, pattern, maxLength, id, label }) => {
  return (
    <>
      <label>
        {label}
        <input onBlur={onBlur} onKeyDown={onkeydown} autoComplete="nope" type={type ? type : 'text'} placeholder={placeholder} onChange={(e) => onChangeHandler(e)} className={className} style={style} pattern={pattern} value={value} id={id ? id : ''} maxLength={maxLength} />
      </label>

      <style jsx>
        {`
          /* Chrome, Safari, Edge, Opera */
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
          input[type='number'] {
            -moz-appearance: textfield;
          }
        `}
      </style>
    </>
  )
}

export default Input
