import { all, fork } from 'redux-saga/effects';
import {
  watchJoin, watchLogin,
} from './userSaga';
import { watchAddImage } from './imageSaga'

export default function* rootSaga() {
  yield all([
    fork(watchJoin),
    fork(watchLogin),
    fork(watchAddImage)
  ]);
}