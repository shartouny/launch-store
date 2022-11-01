import { combineReducers } from 'redux'

import product from './product.reducer'
import products from './products.reducer'
import shopping from './shopping.reducer'
import store from './store.reducer'

const rootReducer = combineReducers({ products, shopping, product, store })

export default rootReducer
