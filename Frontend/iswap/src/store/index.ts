import { createStore } from "vuex";
import tokens from "@/assets/configs/tokens.json"
import pair from "@/assets/configs/pairs.json"
import { Token } from "@/interfaces/Token";
import { Http } from "@/backend/Http";
import { HttpResponse } from "@/interfaces/HttpResponse";
export default createStore({
  state: {
    tokenList: [],
    swapParams: {
      from: null,
      to: null,
      amountIn: 0,
      amountOutMin: 0
    }
  },
  getters: {
    availableTokenList: (state) => {
      return (state.tokenList as Array<Token>).filter((token) => {
        return token
      })
    },
    originalToken: (state) => {
      return state.tokenList.find(token => token.type === "original")
    },
    swapParams: (state) => state.swapParams
  },
  mutations: {
    setTokenList: (state, tokens: Array<Token>) => {
      state.tokenList = tokens
    },
    setFromToken: (state, fromToken) => {
      state.swapParams.from = fromToken
    },
    setToToken: (state, toToken) => {
      state.swapParams.to = toToken
    },
    setAmountIn: (state, amountIn) => {
      state.swapParams.amountIn = amountIn
    },
    setAmountOutMin: (state, amountOutMin) => {
      state.swapParams.amountOutMin = amountOutMin
    }
  },
  actions: {
    getTokenList: ({ commit }) => {
      const _tokens = tokens.map((token) => {
        return new Token(token.symbol, token.name, token.address, token.icon, token.type)
      })
      commit("setTokenList", _tokens)
    },
    reviewSwap: async ({ state, commit }) => {
      const http = new Http()
      const res: HttpResponse = await http.getEstimatedOutMount(state.swapParams.amountIn, [state.swapParams.from.address, state.swapParams.to.address])
      if (res.isSuccess) {
        commit("setAmountOutMin", res.result)
      }
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    },
    confirmSwap: async ({ state, commit }) => {
      const http = new Http()
      const { amountIn, amountOutMin, from, to } = state.swapParams
      if (!amountOutMin) {
        return
      }
      const res = await http.swapTokenToToken(amountIn, amountOutMin, [from.address, to.address], "tNULSeBaMjuwkLhA7iqex8Q3Umrznd62xJwvaJ")
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    }

  },
  modules: {},
});
