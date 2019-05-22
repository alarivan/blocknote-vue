import Vue from "vue";
import Vuex from "vuex";
import _ from "underscore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    userSession: null,
    notes: [],
    search: ""
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
    }
  },

  getters: {
    filteredNotes: state => {
      if (state.search !== "") {
        const match = state.search.match(/:t (.*?);(.*)/);
        if (!_.isNull(match)) {
          const [, tags, search] = match;
          return state.notes.filter(n => {
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

        return state.notes.filter(n =>
          n.raw.toLowerCase().includes(state.search)
        );
      }

      return state.notes;
    }
  }
});
