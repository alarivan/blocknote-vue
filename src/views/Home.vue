<template>
  <div class="container mx-auto relative">
    <div v-if="user" class="pb-12 md:pb-3">
      <button
        v-if="scrolled > 800"
        @click="scrollToTop"
        class="to-top fixed bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded-full shadow-xl"
        title="Back to top"
      >
        <svg class="fill-current w-8 h-8" viewBox="0 0 20 20">
          <path
            d="M13.889,11.611c-0.17,0.17-0.443,0.17-0.612,0l-3.189-3.187l-3.363,3.36c-0.171,0.171-0.441,0.171-0.612,0c-0.172-0.169-0.172-0.443,0-0.611l3.667-3.669c0.17-0.17,0.445-0.172,0.614,0l3.496,3.493C14.058,11.167,14.061,11.443,13.889,11.611 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.692-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.383,10c0-4.07-3.312-7.382-7.383-7.382S2.618,5.93,2.618,10S5.93,17.381,10,17.381S17.383,14.07,17.383,10"
          ></path>
        </svg>
      </button>
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

      <tag-input
        ref="tagsearch"
        placeholder="tags: press 't /' to focus"
        label="tags filter"
        :selected="selectedTags"
        @add="addSelectedTag"
        @remove="removeSelectedTag"
        @clear="clearSelectedTags"
      ></tag-input>

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
        ref="editcomponent"
        v-show="editModeActive"
        :active="editModeActive"
        v-bind:noteInput.sync="noteInput"
        v-bind:tagsInput.sync="tagsInput"
        @cancel="exitEditMode"
        @save="addOrUpdate"
      ></edit>

      <div v-if="loading" class="flex h-48 sm:h-64 justify-center items-center">
        <div class="lds-circle">
          <div></div>
        </div>
      </div>
      <div v-else class="flex flex-wrap">
        <template v-for="(note, index) in filteredNotes">
          <note
            :ref="note._id"
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
    </div>
  </div>
</template>

<script>
import Mousetrap from "mousetrap";
import _ from "underscore";
import { mapActions, mapGetters } from "vuex";

import notesApi from "../api/notes";
import tagsApi from "../api/tags";
import clipboard from "../helper/clipboard";

import Note from "../components/Note";
import Edit from "../components/Edit";
import TagInput from "../components/TagInput";
import { setTimeout } from "timers";

export default {
  name: "landing-page",
  components: { Note, Edit, TagInput },

  data() {
    return {
      tagsInput: "",
      noteInput: "",
      editModeActive: false,
      selected: false,
      selectMode: false,
      editedNote: false,
      loading: false,
      scrolled: 0
    };
  },

  mounted() {
    this.init();

    this.loading = true;

    this.$store.subscribeAction((action, state) => {
      switch (action.type) {
        case "versionUpdateEnd":
          notesApi.init().then(notes => {
            this.loading = false;
            if (typeof this.$refs.search !== "undefined") {
              this.$refs.search.focus();
            }
          });
          break;
      }
    });
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    init() {
      Mousetrap.bind("shift+n", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();

          this.editMode();
        }
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

          this.$refs.tagsearch.focus();
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
          event.preventDefault();
          this.addOrUpdate();
        }
      });

      Mousetrap.bind("tab", event => {
        if (this.editModeActive) {
          event.preventDefault();
          this.$refs.editcomponent.$refs.tags.focus();
        }
      });

      Mousetrap.bind("enter", event => {
        if (event.target == this.tagSearchInput) {
          event.preventDefault();
          this.$refs.tagsearch.addFirstFiltered();
        } else if (event.target == this.$refs.search) {
          event.preventDefault();
          this.$refs.tagsearch.focus();
        }
      });

      Mousetrap.bind("esc", event => {
        if (this.selectMode) {
          event.preventDefault();
          this.exitSelectMode();
        }

        if (this.editModeActive) {
          event.preventDefault();
          if (
            (this.editedNote && this.noteInput !== this.editedNote.body) ||
            (!this.editedNote && this.noteInput !== "")
          ) {
            this.$confirm(
              "You have unsaved changes that will be lost. Are you sure you want to close the editor?",
              () => {
                if (!_.isUndefined(this.$refs.editcomponent)) {
                  this.editMode(false);
                }
              },
              () => {
                if (!_.isUndefined(this.$refs.editcomponent)) {
                  setTimeout(() => {
                    this.$refs.editcomponent.focusEditor();
                  }, 100);
                }
              }
            );
          } else {
            this.editMode(false);
          }
        }
      });

      Mousetrap.bind("s s", event => {
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

      Mousetrap.bind("d d", event => {
        if (this.selectMode) {
          event.preventDefault();
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
          const note = this.$refs[this.selectedNote._id][0];
          note.copyNote();
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
        notesApi.create(body, tags).then(doc => {
          this.addNote(doc);
          this.editMode(false);
        });
      }
    },

    changeNote() {
      const body = this.noteInput.trim();
      const tags = this.tagsInput.trim();
      if (body) {
        notesApi.update(this.editedNote._id, body, tags).then(doc => {
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
      this.$confirm(
        "Are you sure you want to delete this note?",
        () => {
          notesApi.delete(note).then(() => {
            this.removeNote(note._id);
          });
        },
        () => {}
      );
    },

    copyNote(note) {
      const copy = notesApi.getCopy(note.raw);
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
        this.editModeActive = true;
        this.$nextTick(() => {
          const el = document.getElementsByClassName("editor-toolbar")[0];
          el.scrollIntoView({ block: "center" });
        });
      } else {
        this.editModeActive = false;
        this.noteInput = "";
        this.tagsInput = "";
        this.editedNote = false;
      }
    },

    exitEditMode() {
      if (this.editModeActive) {
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
      this.$refs.tagsearch.clear();
      this.clearSelectedTags();
    },

    handleScroll() {
      this.scrolled = window.scrollY;
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    ...mapActions([
      "updateSearch",
      "addNote",
      "updateNote",
      "removeNote",
      "clearSelectedTags",
      "setSelectedTags",
      "addSelectedTag",
      "removeSelectedTag"
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

    searchInput: {
      get() {
        return this.$store.state.search;
      },
      set(value) {
        this.updateSearch(value);
      }
    },

    tagSearchInput() {
      return this.$refs.tagsearch.$refs.tagsearchinput;
    },

    selectedTags() {
      return this.$store.state.selectedTags;
    },

    versionUpdating() {
      return this.$store.state.version_updating;
    },

    ...mapGetters(["filteredNotes"])
  }
};
</script>

<style lang="scss">
.tag-icon-remove {
  top: 5px;
  right: 3px;
}

.to-top {
  left: 10px;
  bottom: 10px;
}
</style>
