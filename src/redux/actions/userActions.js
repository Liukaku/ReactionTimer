import { USER_ATTEMPT } from '../types'

export const recordTimes = (times) => (dispatch) => {
  dispatch({
    type: USER_ATTEMPT,
    times: times
  })
  console.log('this worked so far')
}