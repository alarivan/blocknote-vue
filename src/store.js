import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    userSession: null,
    notes: []
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_USER_SESSION(state, session) {
      state.userSession = session;
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
    }
  }
});
