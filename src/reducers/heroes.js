import { createReducer } from '@reduxjs/toolkit';

import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroAdd,
    heroDelete,
} from '../actions';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
};

const heroes = createReducer(initialState, builder => {
    builder
        .addCase(heroesFetching, state => {
            state.heroesLoadingStatus = 'loading';
        })
        .addCase(heroesFetched, (state, action) => {
            state.heroes = action.payload;
            state.heroesLoadingStatus = 'idle';
        })
        .addCase(heroesFetchingError, state => {
            state.heroesLoadingStatus = 'error';
        })
        .addCase(heroAdd, (state, action) => {
            state.heroes.push(action.payload);
        })
        .addCase(heroDelete, (state, action) => {
            state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
        })
        // .addMatcher((action) => action.type.startsWith('HERO'), state => {
        //     console.log('MATCHHHH');
        // })
        .addDefaultCase(() => {});
});

// const heroes = createReducer(initialState, {
//     [heroesFetching]: state => {
//         state.heroesLoadingStatus = 'loading';
//     },
//     [heroesFetched]: (state, action) => {
//         state.heroes = action.payload;
//         state.heroesLoadingStatus = 'idle';
//     },
//     [heroesFetchingError]: state => {
//         state.heroesLoadingStatus = 'error';
//     },
//     [heroAdd]: (state, action) => {
//         state.heroes.push(action.payload);
//     },
//     [heroDelete]: (state, action) => {
//         state.heroes = state.heroes.filter(hero => hero.id !== action.payload);
//     }
// }, 
// [
//     // {
//     //     matcher(action) {
//     //         return action.type.startsWith('HERO');
//     //     },
//     //     reducer(state, action) {
//     //         console.log('MATCHHHH');
//     //     }
//     // }
// ], 
// () => {});

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'HERO_DELETE':
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(hero => hero.id !== action.payload)
//             }
//         case 'HERO_ADD':
//             return {
//                 ...state,
//                 heroes: [
//                     ...state.heroes,
//                     action.payload,
//                 ]
//             }
//         default: return state
//     }
// }

export default heroes;