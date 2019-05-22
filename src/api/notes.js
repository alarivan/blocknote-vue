import removeMd from "remove-markdown";
import _ from "underscore";

import notes from "../db/notes";
import tagsApi from "../api/tags";
import store from "../store";

export default {
  NOTES_FILE: "/notes.json",

  GET_OPTIONS: {
    encrypt: true
  },

  PUT_OPTIONS: {
    decrypt: true
  },

  loadFromStorage() {
    return store.state.userSession
      .getFile(this.NOTES_FILE, this.GET_OPTIONS)
      .then(data => {
        if (_.isNull(data)) {
          return [];
        } else {
          return JSON.parse(data);
        }
      });
  },

  loadToStorage() {
    notes.find().then(docs => {
      store.state.userSession
        .putFile(this.NOTES_FILE, JSON.stringify(docs), this.PUT_OPTIONS)
        .then(() => {});
    });
  },

  clearStorage() {
    return store.state.userSession
      .putFile(this.NOTES_FILE, "", this.PUT_OPTIONS)
      .then(() => {
        console.log(`${this.NOTES_FILE} cleared`);
      });
  },

  clearDb() {
    return notes.remove({}, { multi: true });
  },

  load() {
    return this.loadFromStorage().then(ns => {
      return this.clearDb().then(() => {
        return notes.insert(ns).then(docs => {
          const promises = docs.map(n => {
            return tagsApi.getTagsForNote(n).then(tags => {
              return this.build(n, tags);
            });
          });

          return Promise.all(promises).then(result => {
            return result;
          });
        });
      });
    });
  },

  build(note, tags) {
    note.raw = removeMd(note.body);
    note.tags = tags;
    return note;
  },

  getCopy(raw) {
    const m = raw.match(/(?<=~c)([\s\S]*?)(?=c~)/);

    if (!_.isNull(m) && !_.isUndefined(m[1])) {
      return m[1].trim();
    }

    return null;
  },

  create(body, tags = "") {
    return tagsApi.createTags(tags).then(data => {
      return notes
        .insert({
          body,
          tags: data.arr
        })
        .then(doc => {
          this.loadToStorage();
          return this.build(doc, data.obj);
        });
    });
  },

  update(id, body, tags = "") {
    return tagsApi.createTags(tags).then(data => {
      return notes
        .update(
          { _id: id },
          {
            body,
            tags: data.arr
          },
          { returnUpdatedDocs: true }
        )
        .then(docs => {
          this.loadToStorage();
          return this.build(docs, data.obj);
        });
    });
  },

  delete(note) {
    // eslint-disable-next-line no-underscore-dangle
    return notes.remove({ _id: note._id }).then(() => {
      this.loadToStorage();
    });
  }
};
