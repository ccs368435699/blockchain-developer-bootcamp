import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import reducers
import { provider, tokens } from './reduces';
const reduces = combineReducers({
    provider,
    tokens
})

const initialState = {}
const middlewear = [thunk]
const store = createStore(reduces, initialState, composeWithDevTools(applyMiddleware(...middlewear)));

export default store;
