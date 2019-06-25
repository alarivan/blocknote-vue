import marked from "marked";
import PlainTextRenderer from "marked-plaintext";
import _ from "underscore";
import { saveAs } from "file-saver";

import store from "../store";
import GenericApi from "./generic";
import notesDb from "../db/notes";
import tagsApi from "../api/tags";

const renderer = new PlainTextRenderer();

class NotesApi extends GenericApi {
  FILE = "notes.json";

  load() {
    return this.loadFromStorage().then(ns => {
      return tagsApi.load().then(() => {
        return this.clearDb().then(() => {
          return notesDb.insert(ns).then(docs => {
            return tagsApi.createFromNotes(docs).then(() => {
              const promises = docs.map(n => {
                return tagsApi.getForNote(n).then(tags => {
                  return this.build(n, tags);
                });
              });

              return Promise.all(promises).then(result => {
                return store.dispatch("setNotes", result);
              });
            });
          });
        });
      });
    });
  }

  build(note, tags) {
    note.raw = marked(note.body, { renderer: renderer });
    note.tags = tags;
    return note;
  }

  getCopy(raw) {
    const m = raw.match(/\^c([\s\S]*?)c\^/);

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

  export(filename = "export.json") {
    return this.db.find({}, { createdAt: 0, updatedAt: 0 }).then(docs => {
      console.log(docs);
      console.log(JSON.stringify(docs));
      const blob = new Blob([JSON.stringify(docs)], {
        type: "text/json;charset=utf-8"
      });
      saveAs(blob, filename);
    });
  }

  import(data) {
    const notes = this.validateImportData(data);

    return this.load().then(() => {
      return tagsApi.createFromNotes(notes).then(() => {
        return notesDb.insert(notes).then(docs => {
          return this.loadToStorage().then(() => {
            return this.load();
          });
        });
      });
    });
  }

  validateImportData(data) {
    const notes = data.map(n => {
      let result = { _id: n._id, body: n.body };

      if (_.isArray(n.tags)) {
        result.tags = n.tags;
      } else {
        result.tags = [];
      }

      return result;
    });

    return this.fixTags(notes);
  }

  fixTags(notes) {
    return notes.map(n => {
      n.tags = _.uniq(
        n.tags.map(t => {
          return t.trim();
        })
      );
      return n;
    });
  }
}

export default new NotesApi(notesDb);
