import _ from "underscore";
import store from "../store";

import GenericApi from "./generic";

class SettingsApi {
  LOCAL_STORAGE_KEY = "blocknote_settings";

  FILE = "settings.json";

  ALL_FILES = ["notes.json", "tags.json"];

  GET_OPTIONS = {
    encrypt: true
  };

  PUT_OPTIONS = {
    decrypt: true
  };

  update_version(files) {
    return {
      version: {
        timestamp: new Date().getTime(),
        changed: files || this.ALL_FILES
      }
    };
  }

  init() {
    this.loadFromStorage.then(data => {
      if (_.isNull(data)) {
        const updated_settins = update_version(false);
        localStorage.setItem(this.LOCAL_STORAGE_KEY, updated_settins);
        this.loadToStorage(updated_settins);
      }
    });
  }

  loadFromStorage() {
    return store.state.userSession
      .getFile(this.FILE, this.GET_OPTIONS)
      .then(data => {
        if (_.isNull(data) || _.isEmpty(data)) {
          return null;
        } else {
          return JSON.parse(data);
        }
      });
  }

  loadToStorage(data) {
    return store.state.userSession.putFile(
      this.FILE,
      JSON.stringify(data),
      this.PUT_OPTIONS
    );
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

export default new SettingsApi();
