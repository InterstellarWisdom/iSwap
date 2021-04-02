import { Token } from "@/interfaces/Token"
import { computed, defineComponent } from "vue"
import { useStore } from "vuex"
export const AssetListTs = defineComponent({
  setup() {
    const store = useStore()
    return {
      tokenList: computed(() => store.getters.availableTokenList)
    }
  },
  methods: {
    handleSelect(token: Token) {
      this.$emit("onTokenSelect", token)
    }
  }
})