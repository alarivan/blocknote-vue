<template>
  <div class="container mx-auto relative">
    <div v-if="user">
      <div class="flex items-center border-b border-b-2 border-teal-500 py-2 mb-2">
        <input
          ref="search"
          v-model="searchInput"
          class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="press / to focus"
          aria-label="filter"
        >
        <div
          class="inline-block border border-gray-600 rounded py-0 px-3 bg-gray-600 text-white h-7"
          v-if="selectMode"
        >SS</div>
      </div>
      <edit
        v-show="adding"
        :active="adding"
        v-bind:noteInput.sync="noteInput"
        v-bind:tagsInput.sync="tagsInput"
      ></edit>

      <div class="flex flex-wrap">
        <template v-for="(note, index) in filteredNotes">
          <note
            :key="index"
            :note="note"
            :index="index"
            :selected="selected"
            @removeNote="removeNote"
            @copyNote="copyNote"
            @editNote="editNote"
          ></note>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import _ from "underscore";
import { mapActions } from "vuex";

import noteApi from "../api/notes";
import tagsApi from "../api/tags";
import clipboard from "../helper/clipboard";

import Note from "../components/Note";
import Edit from "../components/Edit";

export default {
  name: "landing-page",
  components: { Note, Edit },

  data() {
    return {
      searchInput: "",
      tagsInput: "",
      noteInput: "",
      adding: false,
      selected: false,
      notes: [],
      selectMode: false,
      editedNote: false
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      noteApi.loadNotes().then(notes => {
        this.notes = notes;

        if (typeof this.$refs.search !== "undefined") {
          this.$refs.search.focus();
        }
      });

      Mousetrap.bind("shift+n", () => {
        event.preventDefault();

        this.editMode();
      });

      Mousetrap.bind("/", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();
          this.exitSelectMode();
          this.editMode(false);
          if (typeof this.$refs.search !== "undefined") {
            this.$refs.search.focus();
          }
        }
      });

      Mousetrap.bind("c+l", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();
          this.searchInput = "";
        }
      });

      Mousetrap.bind("alt+enter", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag === "textarea" || tag === "input") {
          this.addOrUpdate();
        }
      });

      Mousetrap.bind("esc", () => {
        if (this.selectMode) {
          this.exitSelectMode();
        }

        if (this.adding) {
          this.editMode(false);
        }
      });

      Mousetrap.bind("s s", () => {
        if (this.selectMode) {
          this.exitSelectMode();
        } else {
          this.enterSelectMode();
        }
      });

      Mousetrap.bind("d d", () => {
        if (this.selectMode) {
          this.removeNote(this.filteredNotes[this.selected]);
        }
      });

      Mousetrap.bind(["j", "down"], event => {
        if (this.selectMode) {
          event.preventDefault();
          this.move(this.selected + 2);
          this.scrollToSelected();
        }
      });
      Mousetrap.bind(["k", "up"], event => {
        if (this.selectMode) {
          event.preventDefault();
          this.move(this.selected - 2);
          this.scrollToSelected();
        }
      });
      Mousetrap.bind(["l", "right"], event => {
        if (this.selectMode) {
          event.preventDefault();
          this.move(this.selected + 1);
          this.scrollToSelected();
        }
      });
      Mousetrap.bind(["h", "left"], event => {
        if (this.selectMode) {
          event.preventDefault();
          this.move(this.selected - 1);
          this.scrollToSelected();
        }
      });

      Mousetrap.bind("c", event => {
        if (this.selectMode) {
          event.preventDefault();
          this.copyNote(this.selectedNote);
        }
      });
      Mousetrap.bind("e", event => {
        if (this.selectMode) {
          event.preventDefault();
          this.editNote(this.selectedNote);
        }
      });
    },

    addNote() {
      const body = this.noteInput.trim();
      const tags = this.tagsInput.trim();
      if (body) {
        noteApi.createNote(body, tags).then(doc => {
          this.notes.push(doc);
          this.editMode(false);
        });
      }
    },

    updateNote() {
      const body = this.noteInput.trim();
      const tags = this.tagsInput.trim();
      if (body) {
        noteApi.updateNote(this.editedNote._id, body, tags).then(doc => {
          // eslint-disable-next-line no-underscore-dangle
          const index = this.notes.findIndex(
            n => n._id === this.editedNote._id
          );
          this.notes[index] = doc;
          this.editMode(false);
        });
      }
    },

    addOrUpdate() {
      if (this.editedNote) {
        this.updateNote();
      } else {
        this.addNote();
      }
    },

    removeNote(note) {
      const confirmation = confirm(
        "Are you sure you want to delete this note?"
      );
      if (confirmation) {
        noteApi.deleteNote(note).then(() => {
          // eslint-disable-next-line no-underscore-dangle
          const index = this.notes.findIndex(n => n._id === note._id);
          this.notes.splice(index, 1);
        });
      }
    },
    copyNote(note) {
      const copy = noteApi.getCopy(note.raw);
      if (copy) {
        clipboard(copy);
      } else {
        clipboard(note.raw);
      }
    },

    editNote(note) {
      this.editMode(true);

      this.editedNote = note;
      this.noteInput = note.body;
      this.tagsInput = note.tags
        .map(t => {
          return t.name;
        })
        .join(", ");
    },

    move(position) {
      const notesLength = this.filteredNotes.length;
      if (position < 0) {
        this.selected = 0;
      } else if (position >= notesLength) {
        this.selected = notesLength - 1;
      } else {
        this.selected = position;
      }
    },

    exitSelectMode() {
      this.selectMode = false;
      this.selected = false;
    },

    enterSelectMode() {
      this.editMode(false);
      this.selectMode = true;
      this.selected = 0;

      this.scrollToSelected();
    },

    editMode(enable = true) {
      if (this.selectMode) {
        this.exitSelectMode();
      }

      if (enable) {
        this.adding = true;
        this.$nextTick(() => {
          if (typeof this.$refs.newnote !== "undefined") {
            this.$refs.newnote.focus();
            this.$refs.newnote.scrollIntoView();
          }
        });
      } else {
        this.adding = false;
        this.noteInput = "";
        this.tagsInput = "";
        this.editedNote = false;
      }
    },
    scrollToSelected() {
      if (this.selected < 2) {
        window.scrollTo(0, 0);
      } else {
        document
          .getElementById(this.selectedNote._id)
          .scrollIntoView({ block: "center" });
      }
    }
  },

  computed: {
    filteredNotes() {
      if (this.searchInput !== "") {
        const match = this.searchInput.match(/:t (.*?);(.*)/);
        if (!_.isNull(match)) {
          const [all, tags, search] = match;
          return this.notes.filter(n => {
            const tagList = tags
              .toLowerCase()
              .split(",")
              .map(t => t.trim());
            const found = n.tags.find(t => {
              return tagList.includes(t.name);
            });

            if (search.trim() !== "") {
              return (
                !_.isUndefined(found) &&
                n.raw.toLowerCase().includes(search.trim())
              );
            } else {
              return !_.isUndefined(found);
            }
          });
        }

        return this.notes.filter(n =>
          n.raw.toLowerCase().includes(this.searchInput)
        );
      }

      return this.notes;
    },

    selectedNote() {
      if (this.selected === false) {
        return false;
      }
      return this.filteredNotes[this.selected];
    },
    user() {
      return this.$store.state.user;
    },
    userSession() {
      return this.$store.state.userSession;
    }
  }
};
</script>

<style lang="scss">
</style>
