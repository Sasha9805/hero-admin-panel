import { heroesFetching, heroesFetched, heroesFetchingError } from "../components/heroesList/heroesSlice";
import { filtersFetching, filtersFetched, filtersFetchingError } from "../components/heroesFilters/filtersSlice";

export const fetchHeroes = (request) => (dispatch) => {
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
}

export const fetchFilters = (request) => (dispatch) => {
    dispatch(filtersFetching());
    request('http://localhost:3001/filters')
        .then((filters) => dispatch(filtersFetched(filters)))
        .catch(err => dispatch(filtersFetchingError()));
}