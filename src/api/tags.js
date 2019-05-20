import randomColor from "randomcolor";
import tags from "../db/tags";

function generateColor(color) {
  if (typeof color === "undefined") {
    return randomColor({ luminosity: "light" });
  }

  return color;
}

function createTag(name, color) {
  return tags.insert({
    name,
    color: generateColor(color)
  });
}

function deleteTag(tag) {
  // eslint-disable-next-line no-underscore-dangle
  return tags.remove({ _id: tag._id });
}

function getTagsForNote(note) {
  return tags.find({ name: { $in: note.tags } });
}

function loadTags() {
  return tags.find();
}

function createTags(str) {
  if (str.length > 0) {
    const arr = str.toLowerCase().split(", ");
    return tags.find({ name: { $in: arr } }).then(docs => {
      const newTags = arr.filter(tagName => {
        const index = docs.findIndex(t => {
          return t.name === tagName;
        });
        return index === -1;
      });

      console.log("newtags", newTags);
      const promiseArr = newTags.map(t => {
        return createTag(t);
      });

      return Promise.all(promiseArr).then(result => {
        return { obj: docs.concat(result), arr: arr };
      });
    });
  }
  return Promise.resolve({ obj: [], arr: [] });
}

export default {
  createTag,
  deleteTag,
  loadTags,
  createTags,
  getTagsForNote
};
