import { useContext, useState, useEffect } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {

    const currentUser = useContext(CurrentUserContext);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleNameChange = (evt) => {
        setName(evt.target.value);
    }
    
    const handleDescriptionChange = (evt) => {
        setDescription(evt.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
        // Передаём значения управляемых компонентов во внешний обработчик
        onUpdateUser({
          name,
          about: description,
        });
    } 

    useEffect(() => {
        if (isOpen) {
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [isOpen, currentUser]); 

    return (
        <PopupWithForm  title={'Редактировать профиль'}
                        name={'editProfile'}
                        isOpen={isOpen}
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        buttonText={'Сохранить'}
        >
            <div className="edit-form__field">
                <input name="name" className="edit-form__input" type="text" placeholder="Имя" required minLength="2" maxLength="40" onInput={handleNameChange} value={name}/>
                <span id="name__error" className="edit-form__input-error"></span>
            </div>
            <div className="edit-form__field">
                <input name="job" className="edit-form__input" type="text" placeholder="Деятельность" required minLength="2" maxLength="200" onInput={handleDescriptionChange} value={description}/>
                <span id="job__error" className="edit-form__input-error"></span>
            </div>
        </PopupWithForm>
    );
}

export default EditProfilePopup;