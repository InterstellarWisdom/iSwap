import { defineComponent } from "vue"
import pairs from "@/assets/configs/pairs.json";
import LiquidityDetail from "@/components/liquidity-detail/LiquidityDetail.vue"
export const LiquidityListTs = defineComponent({
  components: {
    LiquidityDetail
  },
  setup() {
    const panelStyle = `background: radial-gradient(91.85% 100% at 1.84% 0%, rgba(252, 7, 125, 0.2) 0%, #EDEEF2 100%);border-radius:5px;margin-bottom:15px;`
    const url = require("@/assets/icons/nuls.png")
    return {
      panelStyle,
      url
    }
  },
  data() {
    return {
      liquidityList: []
    }
  },
  methods: {
    async getLiquidityList() {
      const resArray = await this.$store.dispatch("getTokensBalance", pairs.map(pair => pair.pairAddress))
      if (resArray.isSuccess) {
        this.liquidityList = (resArray.result as Array<{ liquidity: string, pairAddress: string }>)
          .filter(res => parseFloat(res.liquidity) > 0)
          .map((res) => {
            const pair = pairs.find(pair => pair.pairAddress === res.pairAddress)
            pair.liquidity = res.liquidity
            return pair
          })
      }
    }
  },
  mounted() {
    this.getLiquidityList()
  }
})