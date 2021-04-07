import { defineComponent } from "vue"
import TokenSelectAndInput from "@/components/token-select-and-input/TokenSelectAndInput.vue"
import { mapGetters } from "vuex"
export const CreatePairFormTs = defineComponent({
  components: {
    TokenSelectAndInput
  },
  data() {
    return {
      isCreating: false,
      tokenA: null,
      amountA: null,
      tokenB: null,
      amountB: null
    }
  },
  computed:{
    ...mapGetters([
      "originalToken"
    ])
  },
  methods: {
    handleTokenSelectAndInput({ token, amount, id }) {
      if (this.id == "1") {
        this.tokenA = token
        this.amountA = amount
      } else if (this.id == "2") {
        this.tokenB = token
        this.amountB = amount
      }
    },
    createPair() {
      if (this.tokenA && this.amountA && this.tokenB && this.amountB) {
        this.$store.dispatch("createPair", [this.tokenA, this.amountA, this.tokenB, this.amountB])
      }
    }
  }
})