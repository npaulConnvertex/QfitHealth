import { createStore, applyMiddleware } from 'redux';
import rootReducer from "./root-reducer";
import thunk from "redux-thunk";

// export default function configureStore() {
//     const store = createStore(rootReducer, applyMiddleware(thunk));
//     return store;
// }
export default store = createStore(rootReducer, applyMiddleware(thunk));
