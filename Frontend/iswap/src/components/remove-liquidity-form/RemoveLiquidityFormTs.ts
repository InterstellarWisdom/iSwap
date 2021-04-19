
import useGetReserves from "@/composables/useGetReserves"
import useGetTotalLiquidity from "@/composables/useGetTotalLiquidity"
import useSlider from "@/composables/useSlider"
import { Token } from "@/interfaces/Token"
import { computed, defineComponent, ref } from "vue"
import { useStore } from "vuex"
import PasswordFormModal from "@/components/password-form-modal/PasswordFormModal.vue"
export const RemoveLiquidityFormTs = defineComponent({
  components: {
    PasswordFormModal
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
    removedPooled0() {
      return this.reserves.reserve0 * this.liquidity * this.sliderValue / this.totalLiquidity
    },
    removedPooled1() {
      return this.reserves.reserve1 * this.liquidity * this.sliderValue / this.totalLiquidity
    }
  },
  setup() {
    const isRemoving = ref(false)
    const store = useStore()
    const liquidityInfo = computed(() => {
      return store.getters.currentLiquidityInfo
    })
    const { reserves, getReserves } = useGetReserves()
    const { totalLiquidity } = useGetTotalLiquidity(liquidityInfo.value.pairAddress)
    const { sliderValue, setSlider } = useSlider()
    return {
      sliderValue, setSlider, liquidityInfo, reserves, totalLiquidity, isRemoving, getReserves
    }
  },
  mounted() {
    this.getReserves(this.liquidityInfo.pairAddress)
    if (!this.liquidityInfo) {
      this.$router.push({
        name: "pool"
      })
    }
  },
  unmounted() {
    this.$store.commit("setCurrentLiquidityInfo", null)
  },
  methods: {
    async handlePasswordInput(password: string) {
      this.isRemoving = false
      const tokenA = new Token(this.token0, this.token0, this.liquidityInfo.pairContracts.addressA, "", "nrc20", 10)
      const tokenB = new Token(this.token1, this.token1, this.liquidityInfo.pairContracts.addressB, "", "nrc20", 10)
      const res = await this.$store.dispatch("removeLiquidity", [this.liquidity, tokenA, this.removedPooled0, tokenB, this.removedPooled1, password])
      this.isRemoving = false
      console.log(res)
    }
  }
})