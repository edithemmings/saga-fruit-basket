import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import registerServiceWorker from './registerServiceWorker';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects'
// axios
import axios from 'axios';


// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('GET_FRUIT', getFruit)
    yield takeEvery('POST_FRUIT', postFruit)
    yield takeEvery('DELETE_FRUIT', deleteFruit)
}
function* getFruit() {
    try{
        const response = yield axios.get('/fruit');
        yield put({ type: 'SET_BASKET', payload: response.data });
    } catch (error) {
        console.log('error while fetching elements', error)
    }
}
function* postFruit(action) {
    try {
        yield axios.post('/fruit', action.payload);
        yield getFruit();
    } catch (error) {
        console.log('error while fetching elements', error)
    }
}
function* deleteFruit(action){
    try {
        yield axios.delete(`/fruit/${action.payload}`);
        yield getFruit();
    } catch (error) {
        console.log('error while fetching elements', error)
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// This function (our reducer) will be called when an 
// action is dipatched. state = ['Apple'] sets the default 
// value of the array.
const basketReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_BASKET':
            return action.payload;
        default:
            return state;
    }
}

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        basketReducer,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={storeInstance}><App /></Provider>, 
    document.getElementById('root'));
registerServiceWorker();
