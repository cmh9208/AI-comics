import { AnyAction, CombinedState, combineReducers,  configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import logger from 'redux-logger'
import { HYDRATE } from 'next-redux-wrapper';

import userReducer from './slices/user';
import voiceReducer from './slices/voice'
import imageReducer from './slices/image'
import rootSaga from '@/modules/sagas';
import createSagaMiddleware from '@redux-saga/core'
import { TypedUseSelectorHook, useSelector  } from 'react-redux';

const isDev = process.env.NODE_ENV ==='development'
const sagaMiddleware = createSagaMiddleware()


const combinedReducers = combineReducers({
    user : userReducer,
    image : imageReducer,
    voice : voiceReducer
})

const rootReducer = (
	state: ReturnType<typeof combinedReducers>,
    action: AnyAction
) => {
    if(action.type === HYDRATE) {
        return{
            ...state, ...action.payload
        }
    } else{
    return combinedReducers (state,action)      
    }    
}


const makeStore = () =>{
    const store = configureStore({
        reducer:{ rootReducer },
        middleware: (getDefaultMiddleware) =>
        //직렬화 문제 발생 시 {serializableCheck: false} 파라미터로 전달
        getDefaultMiddleware({serializableCheck: false})
            .prepend(sagaMiddleware)
            .concat(logger) ,
        devTools :isDev
    });
    sagaMiddleware.run(rootSaga)
    return store
}
const store = rootReducer

export type AppState = ReturnType<typeof rootReducer>; // store.getState
export type AppDispatch = ReturnType<typeof store>["dispatch"]; // 오류 냅두셈
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const wrapper = createWrapper(makeStore)
export default store;

