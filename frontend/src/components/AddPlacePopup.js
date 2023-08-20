import { useState, useEffect } from "react";
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({isOpen, onClose, onAddPlace}) {

    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    const handleAddName = (evt) => {
        setName(evt.target.value);
      }
    
    const handleAddLink = (evt) => {
        setLink(evt.target.value);
    }

    const handleAddPlaceSubmit = (evt) => {
        evt.preventDefault();
        onAddPlace({ name, link });
    }

    useEffect(() => {
        if (!isOpen) {
          setName('');
          setLink('');
        }
      }, [isOpen]);

    return (
        <PopupWithForm title={'Новое место'}
                        name={'newPlace'}
                        isOpen={isOpen}
                        onClose={onClose}
                        onSubmit={handleAddPlaceSubmit}
                        buttonText={'Создать'}
        >
          <div className="edit-form__field">
            <input name="place_name" className="edit-form__input" type="text" placeholder="Название" minLength="2" maxLength="30" onInput={handleAddName} value={name} required />
            <span id="place_name__error" className="edit-form__input-error"></span>
          </div>
          <div className="edit-form__field">
            <input name="place_link" className="edit-form__input" type="url" placeholder="Ссылка на картинку" onInput={handleAddLink} value={link} required />
            <span id="place_link__error" className="edit-form__input-error"></span>
          </div>
        </PopupWithForm>
    );
}

export default AddPlacePopup;