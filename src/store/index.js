import { configureStore } from '@reduxjs/toolkit';
import heroes from "../reducers/heroes";
import filters from "../reducers/filters";

const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);

    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
        if (typeof action === 'string') {
            return oldDispatch({
                type: action
            });
        }
        return oldDispatch(action);
    };

    return store;
};

const stringMiddleware = ({ dispatch }) => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        });
    }
    return next(action);
};

const store = configureStore({
    reducer: { heroes, filters },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devtools: process.env.NODE_ENV !== 'production'
})

// const store = createStore(
//     combineReducers({heroes, filters}),
//     compose(
//         applyMiddleware(
//             ReduxThunk,
//             stringMiddleware,
//         ),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     )
//     // compose(
//     //     enhancer,
//     //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//     // ) 
// );

export default store;