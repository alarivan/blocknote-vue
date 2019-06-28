import marked from "marked";
import PlainTextRenderer from "marked-plaintext";
import _ from "underscore";
import { saveAs } from "file-saver";

import store from "../store";
import GenericApi from "./generic";
import notesDb from "../db/notes";
import tagsApi from "../api/tags";

import versionApi from "./version";

const renderer = new PlainTextRenderer();

class NotesApi extends GenericApi {
  NAME = "notes";
  FILE = "notes.json";

  init() {
    const local_data = JSON.parse(
      localStorage.getItem(versionApi.LOCAL_STORAGE_KEY)
    );

    const local_notes = this.decrypt(local_data.notes);

    return this.clearDb().then(() => {
      return tagsApi.init().then(() => {
        return this.db.insert(local_notes).then(docs => {
          return tagsApi.createFromNotes(docs).then(tags_data => {
            return this.updateStore(docs);
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
    return tagsApi.createFromString(tags).then(tags_data => {
      return this.db
        .insert({
          body,
          tags: tags_data.arr
        })
        .then(doc => {
          this.updateStorage([doc], tags_data);

          return this.build(doc, tags_data.obj);
        });
    });
  }

  update(id, body, tags = "") {
    return tagsApi.createFromString(tags).then(tags_data => {
      return this.db
        .update(
          { _id: id },
          {
            body,
            tags: tags_data.arr
          },
          { returnUpdatedDocs: true }
        )
        .then(doc => {
          this.updateStorage([doc], tags_data);

          return this.build(doc, tags_data.obj);
        });
    });
  }

  delete(note) {
    // eslint-disable-next-line no-underscore-dangle
    return this.db.remove({ _id: note._id }).then(() => {
      versionApi.update_version([this.NAME]);
    });
  }

  export(filename = "export.json") {
    return this.db.find({}, { createdAt: 0, updatedAt: 0 }).then(docs => {
      const blob = new Blob([JSON.stringify(docs)], {
        type: "text/json;charset=utf-8"
      });
      saveAs(blob, filename);
    });
  }

  import(data) {
    const notes = this.validateImportData(data);

    return this.init().then(() => {
      return tagsApi.createFromNotes(notes).then(tags_data => {
        return this.db.insert(notes).then(docs => {
          return this.updateStorage(docs, tags_data.created).then(() => {
            this.updateStore(docs);
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

  updateStorage(notes, tags) {
    let changed = [];
    if (tags.length) {
      changed.push(tagsApi.NAME);
    }

    if (notes.length) {
      changed.push(this.NAME);
    }

    return versionApi.update_version(changed);
  }

  updateStore(notes) {
    const promises = notes.map(n => {
      return tagsApi.getForNote(n).then(tags => {
        return this.build(n, tags);
      });
    });

    return Promise.all(promises).then(result => {
      return store.dispatch("setNotes", result);
    });
  }
}

export default new NotesApi(notesDb);
