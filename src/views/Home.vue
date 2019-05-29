<template>
  <div class="container mx-auto relative">
    <div v-if="user">
      <div
        class="flex flex-wrap items-center border-b border-b-2 border-teal-500 py-2 mb-2 mx-1 sm:mx-0"
      >
        <input
          ref="search"
          v-model="searchInput"
          class="mousetrap flex-auto appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="search: press '/' to focus"
          aria-label="filter"
        >
        <button
          @click="clearSearch()"
          class="sm:hidden inline-block py-0 px-1 border border-gray-300 bg-gray-300 hover:bg-gray-400 hover:border-gray-400 text-gray-700 rounded h-6"
        >
          <svg class="svg-icon fill-current" viewBox="0 0 20 20">
            <path
              d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"
            ></path>
          </svg>
        </button>
        <button
          @click="editMode()"
          class="hidden sm:block w-40 sm:w-64 inline-block py-0 px-3 border border-teal-500 bg-teal-500 hover:bg-teal-600 hover:border-teal-600 rounded text-white h-7"
        >
          new note
          <span class="hidden sm:inline-block">( shift + n )</span>
        </button>
        <div
          class="inline-block border border-gray-600 py-0 px-3 bg-gray-600 text-white font-bold h-7 ml-2"
          v-if="selectMode"
        >SS</div>
      </div>
      <div class="flex flex-wrap items-center mb-2 mx-1 sm:mx-0">
        <div class="w-full flex-auto border-b border-b-2 border-teal-500 py-2 mb-2">
          <input
            ref="tagsearch"
            v-model="tagSearch"
            class="mousetrap w-full appearance-none bg-transparent border-none text-gray-700 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="tags: press 't /' to focus"
            aria-label="tags filter"
          >
        </div>
        <div class>
          <div
            class="tag text-xs font-bold text-gray-800"
            v-for="(tag, index) in filteredTags"
            :key="index"
          >{{tag.name}}</div>
        </div>
        <div class="border-l-2 border-white">
          <button
            v-for="(tag, index) in selectedTags"
            :key="index"
            @click="removeSelectedTag(tag)"
            class="relative tag text-xs font-bold text-gray-800"
            :style="{ backgroundColor: tag.color }"
          >{{tag.name}}</button>
        </div>
      </div>

      <div class="mx-1 mb-2 sm:hidden">
        <button
          @click="editMode()"
          class="w-full py-2 px-4 border border-teal-500 bg-teal-500 hover:bg-teal-600 hover:border-teal-600 text-white"
        >
          new note
          <span class="hidden sm:inline-block">( shift + n )</span>
        </button>
      </div>

      <edit
        v-show="adding"
        :active="adding"
        v-bind:noteInput.sync="noteInput"
        v-bind:tagsInput.sync="tagsInput"
        @cancel="exitEditMode"
        @save="addOrUpdate"
      ></edit>

      <div v-if="notes.length" class="flex flex-wrap">
        <template v-for="(note, index) in filteredNotes">
          <note
            :key="note._id"
            :note="note"
            :index="index"
            :selected="selected"
            @deleteNote="deleteNote"
            @copyNote="copyNote"
            @editNote="editNote"
          ></note>
        </template>
      </div>
      <div v-else class="flex h-48 sm:h-64 justify-center items-center">
        <div class="lds-circle">
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import _ from "underscore";
import { mapActions, mapGetters } from "vuex";

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
      tagsInput: "",
      noteInput: "",
      adding: false,
      selected: false,
      selectMode: false,
      editedNote: false
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      if (this.$store.state.notes.length === 0) {
        noteApi.load().then(notes => {
          this.setNotes(notes);

          if (typeof this.$refs.search !== "undefined") {
            this.$refs.search.focus();
          }
        });
      }

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

      Mousetrap.bind("t /", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();
          this.exitSelectMode();
          this.editMode(false);
          if (typeof this.$refs.tagsearch !== "undefined") {
            this.$refs.tagsearch.focus();
          }
        }
      });

      Mousetrap.bind("r r", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();
          this.clearSearch();
        }
      });

      Mousetrap.bind("alt+enter", event => {
        if (this.noteInput) {
          this.addOrUpdate();
        }
      });

      Mousetrap.bind("enter", event => {
        if (event.target == this.$refs.tagsearch && this.filteredTags.length) {
          this.addSelectedTag(this.filteredTags[0]);
        } else if (event.target == this.$refs.search) {
          this.$refs.tagsearch.focus();
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
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();
          if (this.selectMode) {
            this.exitSelectMode();
          } else {
            this.enterSelectMode();
          }
        }
      });

      Mousetrap.bind("d d", () => {
        if (this.selectMode) {
          this.deleteNote(this.filteredNotes[this.selected]);
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

    addNewNote() {
      const body = this.noteInput.trim();
      const tags = this.tagsInput.trim();
      if (body) {
        noteApi.create(body, tags).then(doc => {
          this.addNote(doc);
          this.editMode(false);
        });
      }
    },

    changeNote() {
      const body = this.noteInput.trim();
      const tags = this.tagsInput.trim();
      if (body) {
        noteApi.update(this.editedNote._id, body, tags).then(doc => {
          this.updateNote(doc);
          this.editMode(false);
        });
      }
    },

    addOrUpdate() {
      if (this.editedNote) {
        this.changeNote();
      } else {
        this.addNewNote();
      }
    },

    deleteNote(note) {
      const confirmation = confirm(
        "Are you sure you want to delete this note?"
      );
      if (confirmation) {
        noteApi.delete(note).then(() => {
          this.removeNote(note._id);
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
          const el = document.getElementsByClassName("editor-toolbar")[0];
          el.scrollIntoView({ block: "center" });
        });
      } else {
        this.adding = false;
        this.noteInput = "";
        this.tagsInput = "";
        this.editedNote = false;
      }
    },

    exitEditMode() {
      if (this.adding) {
        this.editMode(false);
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
    },

    clearSearch() {
      this.searchInput = "";
      this.tagSearch = "";
      this.clearSelectedTags();
    },

    ...mapActions([
      "setNotes",
      "updateSearch",
      "addNote",
      "updateNote",
      "removeNote",
      "updateTagSearch",
      "addSelectedTag",
      "removeSelectedTag",
      "clearSelectedTags"
    ])
  },

  computed: {
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
    },

    notes() {
      return this.$store.state.notes;
    },

    selectedTags() {
      return this.$store.state.selectedTags;
    },

    searchInput: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.updateSearch(value);
      }
    },

    tagSearch: {
      get() {
        return this.$store.state.tagSearch;
      },
      set(value) {
        this.updateTagSearch(value);
      }
    },

    ...mapGetters(["filteredNotes", "filteredTags"])
  }
};
</script>

<style lang="scss">
.tag-icon-remove {
  top: 5px;
  right: 3px;
}
</style>
