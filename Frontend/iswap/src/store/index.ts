import { createStore } from "vuex";
import tokens from "@/assets/configs/tokens.json"
import { Token } from "@/interfaces/Token";
import { HttpService } from "@/service/HttpService";
export default createStore({
  state: {
    tokenList: [],
    swapParams:null
  },
  getters: {
    tokenList: (state) => {
      return state.tokenList
    }
  },
  mutations: {
    setTokenList: (state, tokens: Array<Token>) => {
      state.tokenList = tokens
    }
  },
  actions: {
    getTokenList: ({ commit }) => {
      commit("setTokenList", tokens)
    },
    swap:({commit})=>{
      const http=new HttpService()
    }
  },
  modules: {},
});
