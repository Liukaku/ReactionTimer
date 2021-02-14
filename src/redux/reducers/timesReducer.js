import { USER_ATTEMPT } from '../types'

const initialState = {
  seconds: 0,
  milliseconds: 0,
  readyCheck: false,
  passFail: false,
  times: []
}

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_ATTEMPT:
      return {
        ...state,
        times: action.payload
      }

    default:
      break;
  }
}