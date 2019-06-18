import _ from "underscore";
import store from "../store";

import defaultSettings from "../constants/settings";

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
      timestamp: new Date().getTime(),
      changed: files || this.ALL_FILES
    };
  }

  init() {
    this.loadFromStorage.then(data => {
      if (_.isNull(data)) {
        const updated_settings = {
          version: update_version(false),
          settings: defaultSettings
        };

        localStorage.setItem(this.LOCAL_STORAGE_KEY, updated_settings);
        this.loadToStorage(updated_settings);
      } else {
        const remote_settings = JSON.parse(data);
        const local_settings = JSON.parse(
          localStorage.getItem(this.LOCAL_STORAGE_KEY)
        );

        if (
          local_settings !== null &&
          remote_settings.version.timestamp !== local_settings.version.timestamp
        ) {
          // then load all the changed files
          remote_settings.version.changed.forEach(f => {
            // load file
          });

          localStorage.setItem(this.LOCAL_STORAGE_KEY, data);
        } else if (local_settings === null) {
          localStorage.setItem(this.LOCAL_STORAGE_KEY, data);
        }
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
}

export default new SettingsApi();
