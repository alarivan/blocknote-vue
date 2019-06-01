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

  createFromString(str) {
    if (str.length > 0) {
      const arr = str
        .toLowerCase()
        .trim()
        .split(",")
        .map(t => t.trim());

      return this.createMultiple(arr).then(result => {
        if (result.created.length > 0) {
          this.loadToStorage();
          this.updateStore();
        }

        return { obj: result.all, arr: arr };
      });
    }
    return Promise.resolve({ obj: [], arr: [] });
  }

  createFromNotes(notes) {
    const tags = notes
      .filter(n => {
        return _.isArray(n.tags);
      })
      .map(n => {
        return n.tags;
      });

    return this.createMultiple(tags).then(data => {
      if (data.created.length) {
        this.loadToStorage();
        this.updateStore();
      }
    });
  }

  // tags = ["tag", "tag1"]
  createMultiple(tags) {
    const flat = _.uniq(_.flatten(tags));

    return this.db.find({ name: { $in: flat } }).then(docs => {
      const newTags = flat.filter(tagName => {
        const index = docs.findIndex(t => {
          return t.name === tagName;
        });
        return index === -1;
      });

      const toInsert = this.buildMultiple(newTags);

      return this.db.insert(toInsert).then(result => {
        return { created: result, all: docs.concat(result) };
      });
    });
  }

  // tags = ["tag", "tag1"]
  buildMultiple(tags) {
    return tags
      .filter(t => {
        return !_.isEmpty(t);
      })
      .map(t => {
        return {
          name: t,
          color: this.generateColor()
        };
      });
  }
}

export default new TagsApi(tagsDb);
