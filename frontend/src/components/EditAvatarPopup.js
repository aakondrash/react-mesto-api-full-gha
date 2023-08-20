import { useEffect, useRef } from "react";
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {

    const avatarLink = useRef();

    function handleUpdateAvatar(e) {
        e.preventDefault();
        onUpdateAvatar({
          avatar: avatarLink.current.value,
        });
    }

    useEffect(() => {
        if (isOpen) {
            avatarLink.current.value = '';
        }
    }, [isOpen]); 

    return (
        <PopupWithForm title={'Обновить аватар'}
                        name={'editAvatar'}
                        isOpen={isOpen}
                        onClose={onClose}
                        onSubmit={handleUpdateAvatar}
                        buttonText={'Сохранить'}
        >
          <div className="edit-form__field">
            <input ref={avatarLink} name="avatar" className="edit-form__input" type="url" placeholder="Ссылка на новую аватарку" required/>
            <span id="avatar__error" className="edit-form__input-error"></span>
          </div>
        </PopupWithForm>
    );
}

export default EditAvatarPopup;