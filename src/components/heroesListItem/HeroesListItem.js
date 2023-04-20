import classNames from "classnames";

import './heroesListItem.scss';

const HeroesListItem = ({name, description, element, onDeleteHero, nodeRef}) => {
    return (
        <li 
            ref={nodeRef}
            className={classNames(
                "heroes__list-item card flex-row mb-4 shadow-lg text-white bg-gradient",
                {"bg-warning": element === 'all'},
                {"bg-danger": element === 'fire'},
                {"bg-primary": element === 'water'},
                {"bg-success": element === 'wind'},
                {"bg-secondary": element === 'earth'}
            )}>
            <img src="http://www.stpaulsteinbach.org/wp-content/uploads/2014/09/unknown-hero.jpg" 
                 className="img-fluid w-25 d-inline" 
                 alt="unknown hero" 
                 style={{'objectFit': 'cover'}}/>
            <div className="card-body">
                
                <h3 className="card-title">{name}</h3>
                <p className="card-text">{description}</p>
            </div>
            <span onClick={onDeleteHero} className="position-absolute top-0 start-100 translate-middle badge border rounded-pill bg-light">
                <button type="button" className="btn-close btn-close" aria-label="Close"></button>
            </span>
        </li>
    )
}

export default HeroesListItem;