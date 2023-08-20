import cross from '../images/cross.svg';
import tick from '../images/tick.svg';

export default function InfoTooltip({ isSucceeded, isOpened, onClose }) {
  
    return (
        <div className={`popup ${isOpened && 'popup_opened'}`} >
            <div className="popup__container info-tooltip">
                <img className="info-tooltip__image"
                     src={isSucceeded ? tick : cross}
                     alt={isSucceeded ? 'Регистрация успешна' : 'Ошибка при регистрации'}
                />
                <h2 className="info-tooltip__title">
                {isSucceeded ? "Вы успешно зарегистрировались!" : "Что-то пошло не так! Попробуйте ещё раз."}
                </h2>
                <button type="button"
                        className="popup__close-button"
                        onClick={onClose}></button>
            </div>
        </div>
    );
  };
