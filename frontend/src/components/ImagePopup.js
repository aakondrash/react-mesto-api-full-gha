

function ImagePopup({card, onClose}) {
    return (
        <div id="openFullScreen" className={`popup popup_dark ${card? 'popup_opened':''}`}>
            <div className="popup__container popup__container_fullscreen">
              <div className="image">
                <img className="image__photo" src={card?.link} alt="Фото на весь экран"/>
                <p className="image__description">{card?.name}</p>
                <button type="button" className="popup__close-button" onClick={onClose}></button>
              </div>
            </div>
        </div>
    );
}

export default ImagePopup;