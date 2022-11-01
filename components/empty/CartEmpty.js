import Link from 'next/link'
import React from 'react'

import EmptyShoppingCart from '/components/icons/emptyshoppingcart'

export default function CartEmpty({ slug, color }) {
  return (
    <div className="flex flex-col justify-center items-center mt-72 ">
      <EmptyShoppingCart width={100} height={100} color={color} />
      <p className="mt-4 text-lg font-medium text-center text-gray-800">
        Your shopping Cart <br />
        is empty
      </p>
      <Link href={`/store/${slug}`}>
        <a className="py-2 px-6 mt-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm">Browse Items</a>
      </Link>
    </div>
  )
}
