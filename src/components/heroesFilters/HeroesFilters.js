import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";

import { useHttp } from "../../hooks/http.hook";
import { filterChange, filtersFetched, filtersFetching, filtersFetchingError } from "../../actions";

import Spinner from "../spinner/Spinner";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
    const { request } = useHttp();

    const filters = useSelector(state => state.filters);
    const filtersLoadingStatus = useSelector(state => state.filtersLoadingStatus);
    const activeFilter = useSelector(state => state.activeFilter);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(filtersFetching());
        request('http://localhost:3001/filters')
            .then((filters) => dispatch(filtersFetched(filters)))
            .catch(err => dispatch(filtersFetchingError()));
    }, []);

    const onFilterChange = useCallback((activeFilter) => {
        dispatch(filterChange(activeFilter));
    }, [dispatch]);

    if (filtersLoadingStatus === "loading") {
        return (
            <div style={{display: 'flex'}}>
                <Spinner/>
            </div>
        );
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderFilters = (arr, activeFilter) => {
        return arr.map(({ value, text }) => {
            return (
                <button
                    key={value} 
                    className={classNames(
                        "btn",
                        {"btn-outline-dark": value === 'all'},
                        {"btn-danger": value === 'fire'},
                        {"btn-primary": value === 'water'},
                        {"btn-success": value === 'wind'},
                        {"btn-secondary": value === 'earth'},
                        {"active": value === activeFilter},
                    )}
                    onClick={() => onFilterChange(value)}>{text}</button>
            );
        });
    };
    const filtersToRender = renderFilters(filters, activeFilter);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {filtersToRender}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;