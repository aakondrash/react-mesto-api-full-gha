class AuthApi {
  constructor(options) {
    this._urlBody = options.urlBody;
  }

  _checkRequestStatus(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Something went wrong with status ${res.status}, text: ${res.statusText}`);
    }
  }

  registerUser(email, password) {
    return fetch(`${this._urlBody}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }).then((res) => this._checkRequestStatus(res));
  }

  authorizeUser(email, password, token) {
    return fetch(`${this._urlBody}/signin`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password })
    }).then((res) => this._checkRequestStatus(res))
      .then((data) => {
        if (data.token) {
          const token = data.token;
          localStorage.setItem('jwt', token);
          return token;
        };
      });
  }

  getUserData(token) {
    return fetch(`${this._urlBody}/users/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      }
    }).then((res) => this._checkRequestStatus(res))
      .then(data => data);
  }

}

export const authApi = new AuthApi({
  urlBody: "https://api.mesto.aakondrash.nomoredomainsicu.ru",
  headers: {
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json',
  },
});
