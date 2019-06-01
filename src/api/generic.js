import _ from "underscore";
import store from "../store";

export default class {
  GET_OPTIONS = {
    encrypt: true
  };

  PUT_OPTIONS = {
    decrypt: true
  };

  constructor(db) {
    this.db = db;
  }

  loadFromStorage() {
    return store.state.userSession
      .getFile(this.FILE, this.GET_OPTIONS)
      .then(data => {
        if (_.isNull(data) || _.isEmpty(data)) {
          return [];
        } else {
          return JSON.parse(data);
        }
      });
  }

  loadToStorage() {
    return this.db.find().then(docs => {
      return store.state.userSession.putFile(
        this.FILE,
        JSON.stringify(docs),
        this.PUT_OPTIONS
      );
    });
  }

  clearStorage() {
    return store.state.userSession
      .putFile(this.FILE, "", this.PUT_OPTIONS)
      .then(() => {
        console.log(`${this.FILE} cleared`);
      });
  }

  clearDb() {
    return this.db.remove({}, { multi: true });
  }
}
