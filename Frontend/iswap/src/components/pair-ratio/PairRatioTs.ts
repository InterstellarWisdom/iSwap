import { Token } from "@/interfaces/Token";
import { defineComponent } from "vue";
export const PairRatioTs = defineComponent({
  props: {
    tokenA: {
      type: Token,
      required: true,
      default: null
    },
    amountA: {
      type: String,
      required: true,
      default: null
    },
    tokenB: {
      type: Token,
      required: true,
      default: null
    },
    amountB: {
      type: String,
      required: true,
      default: null
    }
  },
  data() {
    return {
      leftToken: null,
      rightToken: null,
      amountRight: null
    }
  },
  mounted() {
    this.leftToken = this.tokenA
    this.amountRight = parseFloat(this.amountB) / parseFloat(this.amountA)
    this.rightToken = this.tokenB
  }
})