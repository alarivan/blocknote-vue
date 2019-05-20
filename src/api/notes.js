import removeMd from "remove-markdown";
import _ from "underscore";

import notes from "../db/notes";
import tagsApi from "../api/tags";

function getCopy(raw) {
  const m = raw.match(/(?<=~c)([\s\S]*?)(?=c~)/);

  if (!_.isNull(m) && !_.isUndefined(m[1])) {
    return m[1].trim();
  }

  return null;
}

function createNote(body, tags = "") {
  return tagsApi.createTags(tags).then(data => {
    return notes
      .insert({
        body,
        tags: data.arr
      })
      .then(doc => {
        return buildNote(doc, data.obj);
      });
  });
}

function updateNote(id, body, tags = "") {
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
      .then(doc => {
        return buildNote(doc, data.obj);
      });
  });
}

function deleteNote(note) {
  // eslint-disable-next-line no-underscore-dangle
  return notes.remove({ _id: note._id });
}

function loadNotes() {
  return notes.find().then(docs => {
    const ns = docs.map(n => {
      return tagsApi.getTagsForNote(n).then(tags => {
        return buildNote(n, tags);
      });
    });

    return Promise.all(ns).then(result => {
      return result;
    });
  });
}

function buildNote(note, tags) {
  note.raw = removeMd(note.body);
  note.tags = tags;
  return note;
}

export default {
  createNote,
  updateNote,
  deleteNote,
  loadNotes,
  getCopy
};
