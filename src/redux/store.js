import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import userReducer , { restoreSessionAction } from "./userDuck";
import charsReducer,{getCharactersAction,retrieveFavsActions } from "./charsDuck"
import thunk from "redux-thunk";


let rootReducer = combineReducers({
    user : userReducer,
    character: charsReducer
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;



export default function generateStore(){
    let store = createStore(
        rootReducer, 
        composeEnhancers( applyMiddleware(thunk)))
        getCharactersAction() (store.dispatch, store.getState)
        restoreSessionAction() (store.dispatch)
        retrieveFavsActions() (store.dispatch, store.getState)
    return store
} 