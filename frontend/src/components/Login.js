import { useState } from "react";

export default function Login({ onAuth }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (evt) => {
        setEmail(evt.target.value);
    }
    
    const handlePasswordChange = (evt) => {
        setPassword(evt.target.value);
    }

    function handleSubmit(evt) {
        evt.preventDefault();

        if (!email || !password) {
            return;
        }
        onAuth({
            email: email,
            password: password
        });
    }

    return (
      <form className="start-page" onSubmit={handleSubmit}>
          <fieldset className="start-page__fieldset">
              <h2 className="start-page__header">Войти</h2>
              <div className="start-page__field">
                  <input name="name" className="start-page__input" type="text" placeholder="Email" required minLength="2" maxLength="40" autoComplete="off" onInput={handleEmailChange} value={email}/>
                  <span id="name__error" className="start-page__input-error"></span>
              </div>
              <div className="start-page__field">
                  <input name="job" type="password" className="start-page__input" placeholder="Пароль" required minLength="2" maxLength="200" autoComplete="off" onInput={handlePasswordChange} value={password}/>
                  <span id="job__error" className="start-page__input-error"></span>
              </div>
              <button type="submit" className="start-page__button">Войти</button>
          </fieldset>
      </form>
    );
};