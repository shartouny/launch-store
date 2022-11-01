import React from 'react'

import Button from '../button/Button'

export default function ProductEmpty({ isNotFound, title, body, onClickClearAll }) {
  return (
    <div className="flex flex-col justify-center items-center mt-24">
      {isNotFound ? <img src="/icons/not-found.svg" alt="not-found" /> : <img alt={'no-product.svg'} style={{ height: 120 }} src={'/icons/no-product.svg'} />}
      <p className="mt-5 text-2xl font-medium">{title}</p>
      <p className="my-4 text-base">{body}</p>
      {isNotFound ? <Button type="primary" label="Clear All Filters" className="mt-6" click={onClickClearAll} /> : ''}
    </div>
  )
}
