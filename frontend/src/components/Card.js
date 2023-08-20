import React from 'react';

import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card({card, onCardClick, onLikeClick, onDeleteClick}) {

    function handleClick() {
        onCardClick(card);
    }

    const handleLikeClick = ()=>{
        onLikeClick(card);
    }

    const handleDeleteClick = ()=>{
        onDeleteClick(card);
    }

    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    return (
        <li className="element">
            {isOwn && <button type="button" title="Удалить место" className="element__delete-button element__delete-button_is-active" onClick={handleDeleteClick}></button>}
            <img src={card.link} className="element__picture" alt="Фото" onClick={handleClick}/>
            <div className="element__group">
            <h2 className="element__text">{card.name}</h2>
            <div className="element__like">
                <button type="button" className={isLiked ? "element__like-button element__like-button_is-active":"element__like-button"} onClick={handleLikeClick}></button>
                <span className="element__like-number">{card.likes.length}</span>
            </div>
            </div>
        </li>
    );
}

export default Card;