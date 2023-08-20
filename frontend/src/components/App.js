import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import React from 'react';
import ProtectedRoute from './ProtectedRoute';

import '../App.css';
import Header from './Header';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import Main from './Main';
import { api } from '../utils/Api';
import { authApi } from '../utils/AuthApi';
import InfoTooltip from './InfoTooltip';
import Login from './Login';
import Register from './Register';



import { CurrentUserContext } from '../contexts/CurrentUserContext';
import AddPlacePopup from './AddPlacePopup';


function App() {
  const navigate = useNavigate();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoTooltipOpened, setIsInfoTooltipOpened] = useState(false);

  const [isRegistrationSucceeded, setIsRegistrationSucceeded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [currentUser, setCurrentUser] = useState({
    "name": '',
    "about": '',
    "avatar": '',
    "_id": '',
  });
  const [userData, setUserData] = useState({
    _id: '',
    email: ''
  });

  const [cards, setCards] = useState([]);

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard

  const checkUserToken = useCallback(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      authApi.getUserData(jwt)
        .then((res) => {
          const data = res.data;
          const userData = {
            _id: data._id,
            email: data.email
          };
          setUserData(userData);
          handleLogin();
          navigate('../', { replace: true });
        })
        .catch((err) => console.log(err));
    };
  }, [navigate]);

  useEffect(() => {
    checkUserToken();
  }, [checkUserToken]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch((err) => console.log(err));
  }

  const handleCardDelete = (card) => {
    api.deleteCard(card._id)
    .then(res => {
      setCards((state) => state.filter((c) => c._id !== card._id));
      closeAllPopups();
    }).catch((err) => console.log(err));
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null); 
    setIsInfoTooltipOpened(false);
  }
  
  useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen]) 

  const handleUpdateUser = (userInfo) => {
    api.editProfileInfo(userInfo)
      .then(updatedUser => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      }).catch((err) => console.log(err));
  }

  const handleUpdateAvatar = (data) => {
    api.editAvatar(data)
      .then(updatedUser => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      }).catch((err) => console.log(err)); 
  }

  const handleAddPlace = (data) => {
    api.addNewCard(data)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }).catch((err) => console.log(err)); 
  }

  function handleLogin() {
    setIsLoggedIn(true);
  };

  function handleUserRegister(data) {
    authApi.registerUser(data.email, data.password)
      .then((res) => {
        if (res) {
          setIsRegistrationSucceeded(true);
        };
      })
      .catch((err) => {
        console.log(err);
        setIsRegistrationSucceeded(false);
      })
      .finally(() => {
        openInfoTooltip();
      });
  };

  function handleUserAuthorize(data) {
    authApi.authorizeUser(data.email, data.password)
      .then((jwt) => {
        if (jwt) {
          handleLogin();
          navigate('../', { replace: true });
        };
      }).catch((err) => console.log(err)); 
  }

  function openInfoTooltip() {
    setIsInfoTooltipOpened(true);
  };

  useEffect(() => { 
    if (isLoggedIn) {
      Promise.all([api.getProfileInfo(), api.getInitialCards()])
        .then(([user, cards]) => {
          setCurrentUser(user);
          setCards(cards);
        })
        .catch((err) => console.log(err));
    }
  }, [isLoggedIn]); 

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header userData={userData} setIsLoggedIn={setIsLoggedIn}/>
        <Routes>
          <Route path="/sign-in" element={
            <Login onAuth={handleUserAuthorize}/>
          }/>
          <Route path="/sign-up" element={
            <Register onReg={handleUserRegister}/>
          }/>
          <Route exact path="/" element={
            <ProtectedRoute
              element={Main}
              loggedIn={isLoggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />}
          />
        </Routes>
        {isLoggedIn &&
          <Footer />
        }
        <InfoTooltip isOpened={isInfoTooltipOpened} isSucceeded={isRegistrationSucceeded} onClose={closeAllPopups}></InfoTooltip>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/> 
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace}/> 
        <PopupWithForm title={'Вы уверены?'}
                        name={'areYouSure'}
                      //  isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        buttonText={'Да'}
        >
        </PopupWithForm>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
        <ImagePopup card={selectedCard}
                    onClose={closeAllPopups}/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

