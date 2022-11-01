import Accessories from './accessories'
import Apparel from './apparel'
import Cancel from './cancel'
import Caret from './caret'
import Drinkware from './drinkware'
import EmptyShoppingCart from './emptyshoppingcart'
import FilterIcon from './filter'
import All from './grid'
import HomeGoods from './homeGoods'
import Image from './image'
import Kitchenware from './kitchenware'
import Lifestyle from './lifestyle'
import MobileMenu from './mobilemenu'
import Monogram from './monogram'
import New from './new'
import Office from './office'
import Pets from './pets'
import RightCaret from './rightcaret'
import Search from './search'
import Share from './share'
import Sort from './sort'
import Success from './success'
import UpCaret from './upcaret.js'
import WallArt from './wallArt'

const Icon = ({ selectedIcon, color }) => {
  const allIcons = [
    {
      name: 'FilterIcon',
      value: FilterIcon
    },
    {
      name: 'Accessories',
      value: Accessories
    },
    {
      name: 'Apparel',
      value: Apparel
    },
    {
      name: 'Drinkware',
      value: Drinkware
    },
    {
      name: 'HomeGoods',
      value: HomeGoods
    },
    {
      name: 'Image',
      value: Image
    },
    {
      name: 'Kitchenware',
      value: Kitchenware
    },
    {
      name: 'Search',
      value: Search
    },
    {
      name: 'Sort',
      value: Sort
    },
    {
      name: 'New',
      value: New
    },
    {
      name: 'Lifestyle',
      value: Lifestyle
    },
    {
      name: 'Office',
      value: Office
    },
    {
      name: 'Pets',
      value: Pets
    },
    {
      name: 'WallArt',
      value: WallArt
    },
    {
      name: 'Caret',
      value: Caret
    },
    {
      name: 'RightCaret',
      value: RightCaret
    },
    {
      name: 'MobileMenu',
      value: MobileMenu
    },
    {
      name: 'EmptyShoppingCart',
      value: EmptyShoppingCart
    },
    {
      name: 'UpCaret',
      value: UpCaret
    },
    {
      name: 'Monogram',
      value: Monogram
    },
    {
      name: 'Cancel',
      value: Cancel
    },
    {
      name: 'Success',
      value: Success
    },
    {
      name: 'Share',
      value: Share
    },
    {
      name: 'All',
      value: All
    }
  ]
  const icon = allIcons.find((icon) => icon.name === selectedIcon.replace(/\s/g, ''))

  if (icon) {
    return <>{icon.value({ color })}</>
  }

  return null
}

export default Icon
