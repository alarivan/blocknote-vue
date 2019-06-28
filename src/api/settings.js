import _ from "underscore";
import store from "../store";
import defaultSettings, { options } from "../constants/settings";

import versionApi from "./version";

class SettingsApi {
  GET_OPTIONS = {
    encrypt: true
  };

  PUT_OPTIONS = {
    decrypt: true
  };

  NAME = "settings";
  FILE = "settings.json";

  init() {
    const local_data = JSON.parse(
      localStorage.getItem(versionApi.LOCAL_STORAGE_KEY)
    );

    const local = this.decrypt(local_data.settings);

    return store.dispatch("setSettings", _.extend(defaultSettings, local));
  }

  load() {
    return this.loadFromStorage().then(data => {
      return store.dispatch("setSettings", _.extend(defaultSettings, data));
    });
  }

  loadFromStorage() {
    return store.state.userSession
      .getFile(this.FILE, this.GET_OPTIONS)
      .then(data => {
        if (_.isNull(data) || _.isEmpty(data)) {
          return defaultSettings;
        } else {
          return JSON.parse(data);
        }
      });
  }

  loadToStorage() {
    const data = JSON.stringify(store.state.settings);

    return store.state.userSession.putFile(this.FILE, data, this.PUT_OPTIONS);
  }

  clearStorage() {
    return store.state.userSession
      .putFile(this.FILE, "", this.PUT_OPTIONS)
      .then(() => {
        console.log(`${this.FILE} cleared`);
      });
  }

  getEncrypted() {
    const data = JSON.stringify(store.state.settings);
    return {
      name: this.NAME,
      data: store.state.userSession.encryptContent(data)
    };
  }

  decrypt(data) {
    return JSON.parse(store.state.userSession.decryptContent(data));
  }

  verifyOption(key, value) {
    return (
      typeof options[key] !== "undefined" &&
      options[key].find(o => {
        return o.value == value;
      }) !== undefined
    );
  }

  save() {
    return versionApi.update_version([this.NAME]);
  }
}

export default new SettingsApi();
