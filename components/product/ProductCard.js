import { useSelector } from 'react-redux'

const ProductCard = ({ data, onProductClicked, index }) => {
  const name = data?.name?.length > 19 ? `${data.name.substr(0, 19)}...` : data.name
  const shouldShowTooltip = data?.name?.length > 20

  const isChangingCategory = useSelector((state) => state.product.isChangingCategory)

  return (
    <div className="p-3 mx-auto w-40 sm:w-64 md:w-64 lg:w-64 rounded-md border border-c4Gray cursor-pointer h-90" key={index} onClick={onProductClicked}>
      <img alt={'img'} src={isChangingCategory ? '/icons/image-placeholder.svg' : data?.image ?? '/icons/image-placeholder.svg'} className="w-full h-32 sm:h-52 md:h-56 rounded-md" />
      <div className="group relative ">
        <p className="mt-2 text-sm sm:text-xl font-semibold">{name}</p>
        {shouldShowTooltip && <span className="absolute -top-10 py-2 px-4 text-xs font-semibold text-white bg-black rounded-sm opacity-0 group-hover:opacity-90 transition duration-200">{data.name}</span>}
      </div>
      <div className="flex justify-between items-center sm:mt-2">
        <p className="sm:text-xl text:xs">{data.price[0] == data.price[1] ? `$${data.price[0]}` : `from $${data.price[0]}`}</p>
      </div>
    </div>
  )
}

export default ProductCard
