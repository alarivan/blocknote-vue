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
      <div class="flex items-start mb-2 mx-1 sm:mx-0">
        <search ref="tagsearch">
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
          <div
            class="inline-block border border-gray-500 py-2 px-3 bg-gray-500 text-white font-bold mr-2"
            v-if="selectMode"
          >SS</div>
          <button @click="editMode()" class="button primary hidden sm:block">
            new note
            <span class="hidden sm:inline-block">( shift + n )</span>
          </button>
          <button @click="setDrawer(true)" class="hidden sm:block ml-2">
            <svg class="h-10 w-8 fill-current" viewBox="0 0 20 20">
              <path
                d="M10,1.445c-4.726,0-8.555,3.829-8.555,8.555c0,4.725,3.829,8.555,8.555,8.555c4.725,0,8.555-3.83,8.555-8.555C18.555,5.274,14.725,1.445,10,1.445 M10,17.654c-4.221,0-7.654-3.434-7.654-7.654c0-4.221,3.433-7.654,7.654-7.654c4.222,0,7.654,3.433,7.654,7.654C17.654,14.221,14.222,17.654,10,17.654 M14.39,10c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,9.55,14.39,9.752,14.39,10 M14.39,12.702c0,0.247-0.203,0.449-0.45,0.449H6.06c-0.248,0-0.45-0.202-0.45-0.449c0-0.248,0.203-0.451,0.45-0.451h7.879C14.187,12.251,14.39,12.454,14.39,12.702 M14.39,7.298c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,6.848,14.39,7.051,14.39,7.298"
              ></path>
            </svg>
          </button>
        </search>
      </div>

      <div class="flex mx-1 mb-2 sm:hidden">
        <button @click="editMode()" class="flex-auto py-2 px-4 border button primary text-white">
          new note
          <span class="hidden sm:inline-block">( shift + n )</span>
        </button>
        <button @click="setDrawer(true)" class="ml-2 w-16 pr-2 text-center">
          <svg class="h-10 w-8 fill-current mx-auto" viewBox="0 0 20 20">
            <path
              d="M10,1.445c-4.726,0-8.555,3.829-8.555,8.555c0,4.725,3.829,8.555,8.555,8.555c4.725,0,8.555-3.83,8.555-8.555C18.555,5.274,14.725,1.445,10,1.445 M10,17.654c-4.221,0-7.654-3.434-7.654-7.654c0-4.221,3.433-7.654,7.654-7.654c4.222,0,7.654,3.433,7.654,7.654C17.654,14.221,14.222,17.654,10,17.654 M14.39,10c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,9.55,14.39,9.752,14.39,10 M14.39,12.702c0,0.247-0.203,0.449-0.45,0.449H6.06c-0.248,0-0.45-0.202-0.45-0.449c0-0.248,0.203-0.451,0.45-0.451h7.879C14.187,12.251,14.39,12.454,14.39,12.702 M14.39,7.298c0,0.248-0.203,0.45-0.45,0.45H6.06c-0.248,0-0.45-0.203-0.45-0.45s0.203-0.45,0.45-0.45h7.879C14.187,6.848,14.39,7.051,14.39,7.298"
            ></path>
          </svg>
        </button>
      </div>

      <edit/>

      <div v-if="loading" class="flex h-48 sm:h-64 justify-center items-center">
        <div class="lds-circle">
          <div></div>
        </div>
      </div>

      <div v-else class="flex flex-wrap sm:-mx-2">
        <note-view/>
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

export default {
  name: "landing-page",
  components: { NoteView, Note, Edit, TagInput, Search },

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

    if (this.$store.state.notes.length === 0) {
      this.loading = true;
    }

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
          this.filteredNotes.length
        ) {
          event.preventDefault();
          const note = this.$refs[this.filteredNotes[0]._id][0];
          note.copyNote();
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
        const tag = (event.target || event.srcElement).tagName.toLowerCase();

        if (this.selectMode) {
          event.preventDefault();
          const note = this.$refs[this.selectedNote._id][0];
          note.copyNote();
        } else if (
          tag !== "input" &&
          tag !== "textarea" &&
          this.filteredNotes.length
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
          this.filteredNotes.length
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
          this.filteredNotes.length
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
  z-index: 500;
  left: 10px;
  bottom: 10px;
}
</style>
