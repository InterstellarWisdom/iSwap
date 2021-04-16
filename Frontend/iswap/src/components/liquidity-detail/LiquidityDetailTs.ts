
import useGetReserves from "@/composables/useGetReserves";
import useGetTotalLiquidity from "@/composables/useGetTotalLiquidity";
import { defineComponent, onMounted, ref } from "vue";
export const LiquidityDetailTs = defineComponent({
  props: {
    liquidityInfo: {
      required: true,
      default: null
    }
  },
  setup(props) {
    const { totalLiquidity } = useGetTotalLiquidity(props.liquidityInfo.pairAddress)
    const { reserves } = useGetReserves(props.liquidityInfo.pairAddress)
    return {
      totalLiquidity, reserves,
    }
  },
  computed: {
    liquidity() {
      return this.liquidityInfo.liquidity
    },
    token0() {
      return this.liquidityInfo.pairContracts.tokenA < this.liquidityInfo.pairContracts.tokenB ? this.liquidityInfo.pairContracts.tokenA : this.liquidityInfo.pairContracts.tokenB
    },
    token1() {
      return this.liquidityInfo.pairContracts.tokenA < this.liquidityInfo.pairContracts.tokenB ? this.liquidityInfo.pairContracts.tokenB : this.liquidityInfo.pairContracts.tokenA
    },
    pooled0() {
      return this.reserves.reserve0 * this.liquidity / this.totalLiquidity
    },
    pooled1() {
      return this.reserves.reserve1 * this.liquidity / this.totalLiquidity
    }
  },
  methods: {
    goRemoveLiquidity() {
      this.$store.commit("setCurrentLiquidityInfo",this.liquidityInfo)
      this.$router.push({
        name: "removeLiquidity", params: {
          pairAddress: this.liquidityInfo.pairAddress
        }
      })
    }
  }
})