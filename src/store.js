import Vue from "vue";
import Vuex from "vuex";
import _ from "underscore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    userSession: null,
    notes: [],
    search: "",
    tags: [],
    selectedTags: []
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    SET_USER_SESSION(state, session) {
      state.userSession = session;
    },

    SET_SEARCH(state, val) {
      state.search = val;
    },

    SET_NOTES(state, notes) {
      state.notes = notes;
    },

    ADD_NOTE(state, note) {
      state.notes.push(note);
    },

    UPDATE_NOTE(state, note) {
      // eslint-disable-next-line no-underscore-dangle
      const index = state.notes.findIndex(n => n._id === note._id);
      if (index !== -1) {
        let copy = state.notes.slice(0);
        copy[index] = note;
        state.notes = copy;
      } else {
        console.error(`Note with id: ${note._id} was not found.`);
      }
    },

    REMOVE_NOTE(state, id) {
      // eslint-disable-next-line no-underscore-dangle
      const index = state.notes.findIndex(n => n._id === id);
      if (index !== -1) {
        state.notes.splice(index, 1);
      } else {
        console.error(`Note with id: ${id} was not found.`);
      }
    },

    SET_TAGS(state, tags) {
      state.tags = tags;
    },

    SET_SELECTED_TAGS(state, tags) {
      state.selectedTags = tags;
    },

    ADD_SELECTED_TAG(state, tag) {
      state.selectedTags.push(tag);
    },

    REMOVE_SELECTED_TAG(state, tag) {
      // eslint-disable-next-line no-underscore-dangle
      const index = state.selectedTags.findIndex(t => t._id === tag._id);
      if (index !== -1) {
        state.selectedTags.splice(index, 1);
      }
    }
  },
  actions: {
    setUser({ commit }, user) {
      commit("SET_USER", user);
    },

    removeUser({ commit }) {
      commit("SET_USER", null);
    },

    setUserSession({ commit }, session) {
      commit("SET_USER_SESSION", session);
    },

    updateSearch({ commit }, val) {
      commit("SET_SEARCH", val);
    },

    setNotes({ commit }, notes) {
      commit("SET_NOTES", notes);
    },

    addNote({ commit }, note) {
      commit("ADD_NOTE", note);
    },

    updateNote({ commit }, note) {
      commit("UPDATE_NOTE", note);
    },

    removeNote({ commit }, id) {
      commit("REMOVE_NOTE", id);
    },

    setTags({ commit }, tags) {
      commit("SET_TAGS", tags);
    },

    clearSelectedTags({ commit }) {
      commit("SET_SELECTED_TAGS", []);
    },

    setSelectedTags({ commit }, tags) {
      commit("SET_SELECTED_TAGS", tags);
    },

    addSelectedTag({ commit }, val) {
      commit("ADD_SELECTED_TAG", val);
    },

    removeSelectedTag({ commit }, val) {
      commit("REMOVE_SELECTED_TAG", val);
    }
  },

  getters: {
    filteredNotes: state => {
      let result = state.notes;
      if (state.search !== "" || state.selectedTags.length) {
        const lowerCaseSearch = state.search.toLowerCase();
        const match = lowerCaseSearch.match(/:t (.*?);(.*)/);
        if (!_.isNull(match)) {
          const [, tags, search] = match;

          result = state.notes.filter(n => {
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
        } else if (state.selectedTags.length) {
          const selectedTagNames = state.selectedTags.map(t => t.name);

          result = state.notes.filter(n => {
            const intr = _.intersection(
              n.tags.map(t => t.name),
              selectedTagNames
            );

            return intr.length;
          });
        } else {
          result = state.notes.filter(n =>
            n.raw.toLowerCase().includes(lowerCaseSearch)
          );
        }
      }

      return _.sortBy(result, "createdAt");
    }
  }
});
