class Api {
  constructor(options) {
    this._urlBody = options.urlBody;
    this._token = options.token;
  }

  _checkRequestStatus(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Something went wrong with status ${res.status}, text: ${res.statusText}`);
    }
  }

  getProfileInfo() {
    return fetch(`${this._urlBody}/users/me`, {
      method: "GET",
      headers: {
        authorization: this._token,
      },
    }).then((res) => this._checkRequestStatus(res));
  }

  getInitialCards() {
    return fetch(`${this._urlBody}/cards`, {
      method: "GET",
      headers: {
        authorization: this._token,
      },
    }).then((res) => this._checkRequestStatus(res));
  }

  editProfileInfo(data) {
    return fetch(`${this._urlBody}users/me`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => this._checkRequestStatus(res));
  }

  editAvatar(data) {
    return fetch(`${this._urlBody}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => this._checkRequestStatus(res));
  }

  addNewCard(data) {
    return fetch(`${this._urlBody}/cards`, {
      method: "POST",
      headers: {
        authorization: this._token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._checkRequestStatus(res));
  }

  deleteCard(data) {
    return fetch(`${this._urlBody}/cards/${data}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then((res) => this._checkRequestStatus(res));
  }

  handleCardLike(data) {
    return fetch(`${this._urlBody}/cards/likes/${data}`, {
      method: "PUT",
      headers: {
        authorization: this._token,
      },
    }).then((res) => this._checkRequestStatus(res));
  }

  removeCardLike(data) {
    return fetch(`${this._urlBody}/cards/likes/${data}`, {
      method: "DELETE",
      headers: {
        authorization: this._token,
      },
    }).then((res) => this._checkRequestStatus(res));
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.handleCardLike(cardId);
    } else {
      return this.removeCardLike(cardId);
    }
  }


}

export const api = new Api({
  urlBody: "https://api.mesto.aakondrash.nomoredomainsicu.ru"
});
