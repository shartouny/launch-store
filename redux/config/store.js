import { applyMiddleware, createStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducer/root.reducers'
import { persistConfig } from './persist'

const { composeWithDevTools } = require('redux-devtools-extension')
const { persistStore, persistReducer } = require('redux-persist')

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middleware))
  }
  return composeWithDevTools(applyMiddleware(...middleware))
}

export const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a redux
    return createStore(rootReducer, bindMiddleware([thunkMiddleware]))
  } else {
    //If it's on client side, create a redux which will persist

    const persistedReducer = persistReducer(persistConfig, rootReducer) // Create a new reducer with our existing reducer

    const store = createStore(persistedReducer, bindMiddleware([thunkMiddleware])) // Creating the redux again

    store.__persistor = persistStore(store) // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store
  }
}

export const wrapper = createWrapper(makeStore)
