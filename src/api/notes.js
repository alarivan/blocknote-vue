import removeMd from "remove-markdown";
import _ from "underscore";

import GenericApi from "./generic";
import notesDb from "../db/notes";
import tagsApi from "../api/tags";

class NotesApi extends GenericApi {
  FILE = "notes.json";

  load() {
    return this.loadFromStorage().then(ns => {
      return this.clearDb().then(() => {
        return notesDb.insert(ns).then(docs => {
          const promises = docs.map(n => {
            return tagsApi.getForNote(n).then(tags => {
              return this.build(n, tags);
            });
          });

          return Promise.all(promises).then(result => {
            return result;
          });
        });
      });
    });
  }

  build(note, tags) {
    note.raw = removeMd(note.body);
    note.tags = tags;
    return note;
  }

  getCopy(raw) {
    const m = raw.match(/(?<=~c)([\s\S]*?)(?=c~)/);

    if (!_.isNull(m) && !_.isUndefined(m[1])) {
      return m[1].trim();
    }

    return null;
  }

  create(body, tags = "") {
    return tagsApi.createFromString(tags).then(data => {
      return notesDb
        .insert({
          body,
          tags: data.arr
        })
        .then(doc => {
          this.loadToStorage();
          return this.build(doc, data.obj);
        });
    });
  }

  update(id, body, tags = "") {
    return tagsApi.createFromString(tags).then(data => {
      return notesDb
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
  }

  delete(note) {
    // eslint-disable-next-line no-underscore-dangle
    return notesDb.remove({ _id: note._id }).then(() => {
      this.loadToStorage();
    });
  }
}

export default new NotesApi(notesDb);
