import _ from "underscore";
import store from "../store";

import tagsApi from "./tags";
import notesApi from "./notes";

class VersionApi {
  LOCAL_STORAGE_KEY = "blocknotexyz";

  FILE = "version.json";

  ALL_FILES = ["notes", "tags"];

  APIS = {
    notes: notesApi,
    tags: tagsApi
  };

  GET_OPTIONS = {
    encrypt: true
  };

  PUT_OPTIONS = {
    decrypt: true
  };

  update_version_data(files) {
    return {
      key: new Date().getTime(),
      changed: files || this.ALL_FILES
    };
  }

  update_version(files) {
    store.dispatch("versionUpdateBegin");
    const version = this.update_version_data(files);

    return this.prepareData(version).then(result => {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, result);
      const promises = version.changed.map(f => {
        if (this.APIS[f]) {
          return this.APIS[f].loadToStorage();
        }

        return Promise.resolve(false);
      });

      promises.push(this.loadToStorage(version));

      return Promise.all(promises).then(() => {
        store.dispatch("versionUpdateEnd");
      });
    });
  }

  prepareData(version) {
    let result = {
      version: version
    };

    const promises = this.ALL_FILES.map(f => {
      if (this.APIS[f]) {
        return this.APIS[f].getEncrypted();
      }

      return Promise.resolve(false);
    });

    return Promise.all(promises).then(data => {
      data.forEach(e => {
        result[e.name] = e.data;
      });

      return JSON.stringify(result);
    });
  }

  init() {
    return this.loadFromStorage().then(remote => {
      const local = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY));

      store.dispatch("versionUpdateBegin");
      if (_.isNull(remote)) {
        const vers = this.update_version_data(false);
        this.init_local(vers).then(() => {
          store.dispatch("versionUpdateEnd");

          return this.loadToStorage(vers);
        });
      } else if (_.isNull(local)) {
        const vers = {
          key: remote.key,
          changed: this.ALL_FILES
        };
        return this.init_local(vers).then(() => {
          return store.dispatch("versionUpdateEnd");
        });
      } else {
        if (remote.key !== local.version.key) {
          return this.init_local(remote).then(() => {
            return store.dispatch("versionUpdateEnd");
          });
        } else {
          return store.dispatch("versionUpdateEnd");
        }
      }
    });
  }

  init_local(remote) {
    const promises = remote.changed.map(f => {
      if (this.APIS[f]) {
        return this.APIS[f].load();
      }

      return Promise.resolve();
    });

    return Promise.all(promises).then(data => {
      return this.prepareData(remote).then(result => {
        return localStorage.setItem(this.LOCAL_STORAGE_KEY, result);
      });
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

export default new VersionApi();
