import randomColor from "randomcolor";
import _ from "underscore";
import store from "../store";
import tagsDb from "../db/tags";

import GenericApi from "./generic";

class TagsApi extends GenericApi {
  FILE = "tags.json";

  load() {
    return this.loadFromStorage().then(data => {
      return this.clearDb().then(() => {
        return this.db.insert(data).then(docs => {
          return store.dispatch("setTags", docs);
        });
      });
    });
  }

  create(name, color) {
    return this.db.insert({
      name,
      color: this.generateColor(color)
    });
  }

  createFromString(str) {
    if (str.length > 0) {
      const arr = str.toLowerCase().split(",");

      return this.createFromArray(arr).then(result => {
        if (result.created.length > 0) {
          this.loadToStorage();
          this.updateStore();
        }

        return { obj: result.all, arr: arr };
      });
    }
    return Promise.resolve({ obj: [], arr: [] });
  }

  update(id, color) {
    return this.db.update(
      { _id: id },
      {
        color: this.generateColor(color)
      }
    );
  }

  delete(tag) {
    // eslint-disable-next-line no-underscore-dangle
    return this.db.remove({ _id: tag._id });
  }

  getForNote(note) {
    return this.db.find({ name: { $in: note.tags } });
  }

  generateColor(color) {
    if (typeof color === "undefined") {
      return randomColor({ luminosity: "light" });
    }

    return color;
  }

  updateStore() {
    return this.db.find({}).then(docs => {
      return store.dispatch("setTags", docs);
    });
  }

  createFromNotes(notes) {
    const promises = notes
      .filter(n => {
        return _.isArray(n.tags);
      })
      .map(n => {
        return this.createFromArray(n.tags);
      });

    return Promise.all(promises).then(() => {
      this.loadToStorage();
      this.updateStore();
    });
  }

  createFromArray(tags) {
    const arr = tags.map(t => t.trim());

    return this.db.find({ name: { $in: arr } }).then(docs => {
      const newTags = arr.filter(tagName => {
        const index = docs.findIndex(t => {
          return t.name === tagName;
        });
        return index === -1;
      });

      const promises = newTags.map(t => {
        return this.create(t);
      });

      return Promise.all(promises).then(result => {
        return { created: result, all: docs.concat(result) };
      });
    });
  }
}

export default new TagsApi(tagsDb);
