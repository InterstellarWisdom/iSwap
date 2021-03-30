import { Token } from "@/interfaces/Token"
import { computed, defineComponent } from "vue"
import {  useStore } from "vuex"
export const AssetListTs = defineComponent({
  setup() {
    const store = useStore()
    store.dispatch("getTokenList")
    return {
      tokenList: computed(() => store.getters.tokenList)
    }
  },
  methods: {
    handleSelect(token: Token) {
      this.$emit("onTokenSelect", token)
    }
  }
})