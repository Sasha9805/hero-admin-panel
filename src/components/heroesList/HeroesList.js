import { useEffect, useCallback, useRef, createRef } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useHttp } from '../../hooks/http.hook';
import { heroDelete, fetchHeroes } from '../../actions';

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const filteredHeroesSelector = createSelector(
    state => state.filters.activeFilter,
    state => state.heroes.heroes,
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

const HeroesList = () => {
    const { request } = useHttp();

    const filteredHeroes = useSelector(filteredHeroesSelector);
    // const filteredHeroes = useSelector(state => {
    //     if (state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes;
    //     }
    //     return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    // }, shallowEqual);

    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();

    const notFoundRef = useRef(null);
    
    useEffect(() => {
        dispatch(fetchHeroes(request));
        // eslint-disable-next-line
    }, []);

    const onDeleteHero = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
            .then(() => dispatch(heroDelete(id)))
            .catch(err => console.log(err));
    }, [dispatch, request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        return (
            <TransitionGroup appear={true} component={null}>
                {
                    arr.length === 0 
                        ? (
                            <CSSTransition  
                                nodeRef={notFoundRef}
                                timeout={0}
                                classNames="heroes__list-not-found">
                                <h5 ref={notFoundRef} className="text-center mt-5 heroes__list-not-found">Героев пока нет</h5>
                            </CSSTransition>
                        )
                        : arr.map(({id, nodeRef, ...props}, i) => {
                            return (
                                <CSSTransition 
                                    key={id}
                                    nodeRef={nodeRef} 
                                    classNames="heroes__list-item" 
                                    timeout={500}>
                                    <HeroesListItem nodeRef={nodeRef} onDeleteHero={() => onDeleteHero(id)} {...props}/>
                                </CSSTransition>
                            )
                        })
                }
            </TransitionGroup>
        )
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;