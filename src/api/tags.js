import randomColor from "randomcolor";
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
      return this.db.find({ name: { $in: arr } }).then(docs => {
        const newTags = arr
          .map(t => t.trim())
          .filter(tagName => {
            const index = docs.findIndex(t => {
              return t.name === tagName;
            });
            return index === -1;
          });

        const promises = newTags.map(t => {
          return this.create(t);
        });

        return Promise.all(promises).then(result => {
          if (newTags.length > 0) {
            this.loadToStorage();
            this.updateStore();
          }

          return { obj: docs.concat(result), arr: arr };
        });
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
}

export default new TagsApi(tagsDb);
