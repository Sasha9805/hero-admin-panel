import { useCallback, useRef, useMemo, createRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { useGetHeroesQuery, useDeleteHeroMutation } from "../../api/apiSlice";

import './heroesList.scss';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const {
        data: heroes = [],
        isLoading,
        isError,
    } = useGetHeroesQuery();

    const [deleteHero] = useDeleteHeroMutation();

    const activeFilter = useSelector(state => state.filters.activeFilter);
    const filteredHeroes = useMemo(() => {
        const newHeroes = heroes.map(hero => ({
            ...hero,
            nodeRef: createRef(null),
        }));
        if (activeFilter === 'all') {
            return newHeroes;
        }
        return newHeroes.filter(item => item.element === activeFilter);
    }, [heroes, activeFilter]);

    // const filteredHeroes = useSelector(filteredHeroesSelector);
    // const filteredHeroes = useSelector(state => {
    //     if (state.filters.activeFilter === 'all') {
    //         return state.heroes.heroes;
    //     }
    //     return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter);
    // }, shallowEqual);

    const notFoundRef = useRef(null);

    const onDeleteHero = useCallback((id) => {
        deleteHero(id);
    }, []);

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
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