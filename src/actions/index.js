import { createRef } from "react";

export const fetchHeroes = (request) => (dispatch) => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
        .then(data => {
            const newData = data.map(hero => ({
                ...hero,
                nodeRef: createRef(null),
            }));
            dispatch(heroesFetched(newData))
        })
        .catch(() => dispatch(heroesFetchingError()))
}

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request('http://localhost:3001/filters')
        .then((filters) => dispatch(filtersFetched(filters)))
        .catch(err => dispatch(filtersFetchingError()));
}

export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

export const filtersFetching = () => {
    return {
        type: 'FILTERS_FETCHING'
    }
}

export const filtersFetched = (filters) => {
    return {
        type: 'FILTERS_FETCHED',
        payload: filters
    }
}

export const filtersFetchingError = () => {
    return {
        type: 'FILTERS_FETCHING_ERROR'
    }
}

export const heroDelete = (id) => {
    return {
        type: 'HERO_DELETE',
        payload: id
    }
}

export const heroAdd = (hero) => {
    return {
        type: 'HERO_ADD',
        payload: hero
    }
}

export const filterChange = (activeFilter) => {
    return {
        type: 'FILTER_CHANGE',
        payload: activeFilter
    }
}

// export const filterChange = (activeFilter) => (dispatch) => {
//     setTimeout(() => {
//         dispatch({
//             type: 'FILTER_CHANGE',
//             payload: activeFilter
//         })
//     }, 3000);
// }