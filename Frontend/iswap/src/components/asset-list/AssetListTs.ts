import { Token } from "@/interfaces/Token"
import { computed, defineComponent } from "vue"
import { useStore } from "vuex"
export const AssetListTs = defineComponent({
  props: {
    filter: {
      required: false,
      default: null,
      type: Token
    }
  },
  setup(props) {
    const store = useStore()
    return {
      tokenList: computed(() => {
        if (!props.filter) {
          return store.getters.availableTokenList
        } else {
          return (store.getters.availableTokenList as Array<Token>).filter((t) => {
            return t.address !== props.filter.address
          })
        }

      })
    }
  },
  methods: {
    handleSelect(token: Token) {
      this.$emit("onTokenSelect", token)
    }
  }
})