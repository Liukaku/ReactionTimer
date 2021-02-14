import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'


import timesReducer from './reducers/timesReducer'

const middleware = [thunk]

const initialState = {
  times: []
}

const store = createStore(
  timesReducer,
  initialState,
  compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
)

export default store