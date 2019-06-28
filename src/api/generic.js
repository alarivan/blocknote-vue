import _ from "underscore";
import store from "../store";

import versionApi from "./version";

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

  load() {
    return this.loadFromStorage().then(data => {
      return this.clearDb().then(() => {
        return this.db.insert(data);
      });
    });
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
    return this.db.find({}).then(docs => {
      return store.state.userSession.putFile(
        this.FILE,
        JSON.stringify(docs),
        this.PUT_OPTIONS
      );
    });
  }

  clearStorage() {
    return this.clearDb().then(() => {
      store.state.userSession
        .putFile(this.FILE, "", this.PUT_OPTIONS)
        .then(() => {
          console.log(`${this.FILE} cleared`);

          return versionApi.update_version([this.NAME]);
        });
    });
  }

  clearDb() {
    return this.db.remove({}, { multi: true });
  }

  getEncrypted() {
    return this.db.find({}).then(docs => {
      return {
        name: this.NAME,
        data: store.state.userSession.encryptContent(JSON.stringify(docs))
      };
    });
  }

  decrypt(data) {
    return JSON.parse(store.state.userSession.decryptContent(data));
  }
}
