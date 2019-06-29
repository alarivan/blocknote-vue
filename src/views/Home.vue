<template>
  <div class="container mx-auto relative">
    <div v-if="user" class="pb-12 md:pb-3">
      <button
        v-if="scrolled > 800"
        @click="scrollToTop"
        class="to-top fixed bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl"
        title="Back to top"
      >
        <svg class="icon h-10 w-8 mx-auto">
          <use xlink:href="#icon-arrow-up" />
        </svg>
      </button>
      <action-panel v-if="actionPanel" @focusSearch="focusSearch" />
      <div class="flex items-start mb-2 mx-1 sm:mx-0">
        <search ref="tagsearch">
          <button
            title="Clear Search"
            @click="clearSearch()"
            class="clear-search mr-2 px-2 border-2"
          >
            <svg class="icon mx-auto">
              <use xlink:href="#icon-cross" />
            </svg>
          </button>
          <div
            class="inline-block border border-gray-500 py-2 px-3 bg-gray-500 text-white font-bold mr-2"
            v-if="selectMode"
          >SS</div>
          <button @click="editMode()" class="button primary hidden sm:block">
            new note
            <span class="hidden sm:inline-block">( shift + n )</span>
          </button>
          <button @click="setDrawer(true)" class="hidden sm:block ml-2 drawer-trigger">
            <svg class="icon icon-menu mx-auto">
              <use xlink:href="#icon-menu" />
            </svg>
          </button>
        </search>
      </div>

      <div class="flex mx-1 mb-2 sm:hidden">
        <button @click="editMode()" class="flex-auto py-2 px-4 border button primary text-white">
          new note
          <span class="hidden sm:inline-block">( shift + n )</span>
        </button>
        <button @click="setDrawer(true)" class="ml-2 w-16 pr-2 text-center drawer-trigger">
          <svg class="icon icon-menu mx-auto">
            <use xlink:href="#icon-menu" />
          </svg>
        </button>
      </div>

      <edit />

      <div v-if="loading" class="flex h-48 sm:h-64 justify-center items-center">
        <div class="lds-circle">
          <div></div>
        </div>
      </div>

      <div v-else class="flex flex-wrap sm:-mx-2">
        <note-view />
        <template v-for="(note, index) in filteredNotes">
          <note :ref="note._id" :key="note._id" :note="note" :index="index" :selected="selected"></note>
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

import Note from "../components/Note";
import NoteView from "../components/NoteView";
import Edit from "../components/Edit";
import TagInput from "../components/TagInput";
import Search from "../components/Search";
import ActionPanel from "../components/ActionPanel.vue";

export default {
  name: "landing-page",
  components: { NoteView, Note, Edit, TagInput, Search, ActionPanel },

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

    this.loadNotes();
  },

  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    loadNotes() {
      if (this.$store.state.notes.length === 0) {
        this.loading = true;
      }
    },

    init() {
      Mousetrap.bind("shift+n", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          event.preventDefault();

          this.editMode();
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
        const tag = (event.target || event.srcElement).tagName.toLowerCase();

        if (this.selectMode) {
          event.preventDefault();
          const note = this.$refs[this.selectedNote._id][0];
          note.deleteNote();
        } else if (
          tag !== "input" &&
          tag !== "textarea" &&
          this.filteredNotes.length &&
          !this.editorActive &&
          !this.noteView
        ) {
          event.preventDefault();
          const note = this.$refs[this.filteredNotes[0]._id][0];
          note.deleteNote();
        }
      });

      Mousetrap.bind(["j", "down"], event => {
        if (this.selectMode) {
          event.preventDefault();
          this.move(this.selected + this.layoutValue);
          this.scrollToSelected();
        }
      });
      Mousetrap.bind(["k", "up"], event => {
        if (this.selectMode) {
          event.preventDefault();
          this.move(this.selected - this.layoutValue);
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
        const tag = (event.target || event.srcElement).tagName.toLowerCase();

        if (this.selectMode) {
          event.preventDefault();
          const note = this.$refs[this.selectedNote._id][0];
          note.copyNote();
        } else if (
          tag !== "input" &&
          tag !== "textarea" &&
          this.filteredNotes.length &&
          !this.editorActive &&
          !this.noteView
        ) {
          event.preventDefault();
          const note = this.$refs[this.filteredNotes[0]._id][0];
          note.copyNote();
        }
      });

      Mousetrap.bind("e", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();

        if (this.selectMode) {
          event.preventDefault();
          this.setEditorStateNote(this.selectedNote);
        } else if (
          tag !== "input" &&
          tag !== "textarea" &&
          this.filteredNotes.length &&
          !this.editorActive &&
          !this.noteView
        ) {
          event.preventDefault();
          this.setEditorStateNote(this.filteredNotes[0]);
        }
      });

      Mousetrap.bind("v", event => {
        const tag = (event.target || event.srcElement).tagName.toLowerCase();

        if (this.selectMode) {
          event.preventDefault();
          this.setNoteView(this.selectedNote);
        } else if (
          tag !== "input" &&
          tag !== "textarea" &&
          this.filteredNotes.length &&
          !this.editorActive &&
          !this.noteView
        ) {
          event.preventDefault();
          this.setNoteView(this.filteredNotes[0]);
        }
      });
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
      this.setEditorStateActive(enable);
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

    handleScroll() {
      this.scrolled = window.scrollY;
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },

    clearSearch() {
      this.$refs.tagsearch.clear();
    },

    focusSearch() {
      this.$refs.tagsearch.focus();
    },

    ...mapActions([
      "setEditorStateActive",
      "setEditorStateNote",
      "setDrawer",
      "setNoteView"
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

    tagSearchInput() {
      return this.$refs.tagsearch.$refs.tagsearchinput;
    },

    versionUpdating() {
      return this.$store.state.version_updating;
    },

    layoutValue() {
      return this.$store.state.settings.layout.value;
    },

    editorActive() {
      return this.$store.state.editor.active;
    },

    noteView() {
      return this.$store.state.noteView;
    },

    actionPanel() {
      return this.$store.state.settings.actionPanel;
    },

    ...mapGetters(["filteredNotes"])
  },

  watch: {
    notes() {
      this.loading = false;
    }
  }
};
</script>

<style lang="scss">
.tag-icon-remove {
  top: 5px;
  right: 3px;
}

.to-top {
  z-index: 500;
  left: 10px;
  bottom: 10px;

  @apply p-2;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
