import { createSelector, createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { createRef } from "react";
import { useHttp } from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/heroes")
    }
);

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroAdd: heroesAdapter.addOne,
        heroDelete: heroesAdapter.removeOne
    },
    extraReducers: builder => {
        builder
            .addCase(fetchHeroes.pending, (state) => {
                state.heroesLoadingStatus = 'loading'
            })
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                heroesAdapter.setAll(state, action.payload);
            })
            .addCase(fetchHeroes.rejected, (state) => {
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => {})
    }
});

const { actions, reducer } = heroesSlice;
const { selectAll } = heroesAdapter.getSelectors(state => state.heroes);

export default reducer;

export const {
    heroAdd,
    heroDelete
} = actions;

export const filteredHeroesSelector = createSelector(
    state => state.filters.activeFilter,
    selectAll,
    (activeFilter, heroes) => {
        const newHeroes = heroes.map(hero => ({
            ...hero,
            nodeRef: createRef(null),
        }));
        if (activeFilter === 'all') {
            return newHeroes;
        }
        return newHeroes.filter(item => item.element === activeFilter);
    }
);