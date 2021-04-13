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
      const res = await this.$store.dispatch("getTokensBalance", pairs.map(pair => pair.pairAddress))
      /*    if(res.isSuccess){
           (res.result as Array<{liquidity:string,pairAddress:string}>).
         } */
    }
  },
  mounted() {
    this.getLiquidityList()
  }
})