import { createStore } from "vuex";

export default createStore({
  state: {
    modals: []
  },
  getters: {
    activeModals: (state) => {
      return state.modals
    }
  },
  mutations: {
    closeModal: (state, modalName: string) => {
      if (modalName) {
        const newModals = state.modals.filter((name) => name !== modalName)
        state.modals = newModals
      }
      state.modals.pop()
    },
    openModal: (state, modalName: string) => {
      if (modalName) {
        state.modals.push(modalName)
      }
    }
  },
  actions: {},
  modules: {},
});
