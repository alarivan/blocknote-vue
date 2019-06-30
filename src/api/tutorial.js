import notesApi from "./notes";
import TUTORIAL_NOTES from "../constants/tutorial_notes";

export function resetTutorialNotes() {
  return notesApi
    .deleteMany({
      $and: [
        { position: { $in: [1, 2, 3, 4, 5, 6, 7, 8] } },
        { tags: ["tutorial"] }
      ]
    })
    .then(() => {
      return notesApi.import(TUTORIAL_NOTES);
    });
}

export function clearTutorialNotes() {
  return notesApi
    .deleteMany({
      $and: [
        { position: { $in: [1, 2, 3, 4, 5, 6, 7, 8] } },
        { tags: ["tutorial"] }
      ]
    })
    .then(deletedNum => {
      if (deletedNum) {
        return notesApi.init();
      } else {
        return deletedNum;
      }
    });
}
