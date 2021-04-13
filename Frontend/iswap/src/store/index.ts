import { createStore } from "vuex";
import tokens from "@/assets/configs/tokens.json"
import { Token } from "@/interfaces/Token";
import { Http } from "@/backend/Http";
import { HttpResponse } from "@/interfaces/HttpResponse";
import { Helper } from "@/helper/Helper";
export default createStore({
  state: {
    tokenList: [],
    swapParams: {
      from: null,
      to: null,
      amountIn: 0,
      amountOutMin: 0
    },
    address: ""
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
    swapParams: (state) => state.swapParams,
    address: (state) => state.address
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
    },
    setAddress: (state, address: string) => {
      state.address = address
    }
  },
  actions: {
    initialize: ({ dispatch }) => {
      dispatch("getTokenList")
      dispatch("getAddress")
    },
    getAddress: ({ commit }) => {
      const address = localStorage.getItem('address')
      commit("setAddress", address)
    },
    setAddress: ({ commit }, payload: string) => {
      commit("setAddress", payload)
      localStorage.setItem("address", payload)
    },
    getTokenList: ({ commit }) => {
      const _tokens = tokens.map((token) => {
        return new Token(token.symbol, token.name, token.address, token.icon, token.type, token.decimal)
      })
      commit("setTokenList", _tokens)
    },
    reviewSwap: async ({ state, commit }) => {
      const res: HttpResponse = await Http.getEstimatedOutMount(state.swapParams.amountIn, [state.swapParams.from.address, state.swapParams.to.address])
      if (res.isSuccess) {
        commit("setAmountOutMin", res.result)
      }
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    },
    /**
     * @description:payload is password
     */
    confirmSwap: async ({ state, getters }, payload: string) => {
      const http = new Http(getters["address"], payload)
      const { amountIn, amountOutMin, from, to } = state.swapParams

      if (!amountOutMin) {
        return
      }
      let res: HttpResponse
      if (from.type === "original") {
        res = await http.swapNulsToToken(amountIn, amountOutMin, [from.address, to.address], "tNULSeBaMjuwkLhA7iqex8Q3Umrznd62xJwvaJ")
      } else if (to.type === "original") {
        res = await http.swapTokenToNuls(amountIn, amountOutMin, [from.address, to.address], "tNULSeBaMjuwkLhA7iqex8Q3Umrznd62xJwvaJ")
      } else {
        res = await http.swapTokenToToken(amountIn, amountOutMin, [from.address, to.address], "tNULSeBaMjuwkLhA7iqex8Q3Umrznd62xJwvaJ")
      }
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    },
    /**
     * payload[0] is tokenA
     * payload[1] is amountA
     * payload[2] is tokenB
     * payload[3] is amountB
     * payload[4] is password
     */
    createPair: async ({ getters, dispatch }, payload: any[]) => {
      const http = new Http(getters["address"], payload[4])
      const createRes = await http.createPair(payload[0].address, payload[2].address)
      if (createRes.isSuccess) {
        const addRes = await dispatch("addLiquidity", payload)
        return Promise.resolve(addRes)
      } else {
        return Promise.resolve(createRes)
      }

    },


    /**
     * payload[0] is tokenA
     * payload[1] is amountA
     * payload[2] is tokenB
     * payload[3] is amountB
     * payload[4] is password
     */
    addLiquidity: async ({ getters }, payload) => {
      const http = new Http(getters["address"], payload[4])
      let res: HttpResponse = null
      if (payload[0].type === "original" || payload[1].type === "original") {
        if (payload[0].type === "original") {
          res = await http.addLiquidityNuls(payload[1], payload[2], payload[3])
        } else {
          res = await http.addLiquidityNuls(payload[3], payload[0], payload[1])
        }
      } else {
        res = await http.addLiquidity(payload[0], payload[1], payload[2], payload[3])
      }
      return Promise.resolve(res)
    },
    removeLiquidity: ({ state }, payload) => {
      //
    },
    /**
     * payload[0] is private key
     * payload[1] is password
     */
    importPrivateKey: async ({ dispatch }, payload: any[]) => {
      const res = await Http.importPrivateKey(payload[0], payload[1])
      if (res.isSuccess) {
        dispatch("setAddress", res.result)
      }
      return Promise.resolve(res)
    },
    /**
     * payload is password
     */
    createAccount: async ({ dispatch }, payload: string) => {
      const res = await Http.createAccount(payload)
      if (res.isSuccess) {
        dispatch("setAddress", res.result)
      }
      return Promise.resolve(res)
    },
    getNulsBalance: async ({ getters }) => {
      const res = await Http.getNulsBalance(getters["address"])
      if (res.isSuccess) {
        res.result = Helper.handleAccuracy(res.result, 8)
      }
      return Promise.resolve(res)
    },
    /**
     * @description: payload is contract address
     */
    getTokenBalance: async ({ getters }, payload) => {
      const res = await Http.getTokenBalance(payload, getters["address"])
      if (res.isSuccess) {
        res.result = Helper.handleAccuracy(res.result, 10)
      }
      return Promise.resolve(res)
    },
    /**
     * @description: payload is contract address[]
     */
    getTokensBalance: async ({ getters }, payload) => {
      const res = await Http.getTokensBalance(payload, getters["address"])
      return Promise.resolve(res)
    }
  },
  modules: {},
});
