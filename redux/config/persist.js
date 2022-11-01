import storage from 'redux-persist/lib/storage'

//todo readd to white list the neccessary reducer
export const persistConfig = {
  key: 'TS-STORE-V-3',
  version: 4,
  storage: storage,
  whitelist: ['shopping'],
  blacklist: ['store']
}
