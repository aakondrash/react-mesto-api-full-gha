import React from 'react';
import Card from './Card';

import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Main({cards, onEditProfile, onAddPlace, onEditAvatar, onCardClick, onCardLike, onCardDelete}) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__avatar" onClick={onEditAvatar}>
                    <img className="profile__avatar-image" src={currentUser.avatar} alt="Аватарка"/>
                    <button aria-label="Кнопка изменения аватарки" type="button" className="profile__avatar-edit-button"></button>
                </div>
                <div className="profile__profile-info">
                    <h1 className="profile__name">{currentUser.name}</h1>
                    <p className="profile__description">{currentUser.about}</p>
                    <button aria-label="Кнопка редактирования профиля" type="button" className="profile__edit-button" onClick={onEditProfile}></button>
                </div>
                <button type="button" className="profile__add-button" onClick={onAddPlace}></button>
            </section>
            <section className="elements">
                <ul className="elements__list">
                    {
                        cards.map((card) => (
                            <Card key={card._id} card={card} onCardClick={onCardClick} onLikeClick={onCardLike} onDeleteClick={onCardDelete}/>
                        ))
                    }
                </ul>
            </section>
        </main>
    );
}

export default Main;