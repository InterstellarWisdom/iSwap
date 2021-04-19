import { defineComponent } from "vue"
import TokenSelectAndInput from "@/components/token-select-and-input/TokenSelectAndInput.vue"
import PasswordFormModal from "@/components/password-form-modal/PasswordFormModal.vue";
import { notification } from "ant-design-vue"
import { HttpResponse } from "@/interfaces/HttpResponse"
import useGetReserves from "@/composables/useGetReserves";
import { Helper } from "@/helper/Helper";
export const AddLiquidityFormTs = defineComponent({
  components: {
    TokenSelectAndInput,
    PasswordFormModal
  },
  setup() {
    const { reserves, getReserves } = useGetReserves()
    return {
      reserves, getReserves
    }
  },
  data() {
    return {
      isAdding: false,
      tokenA: null,
      amountA: null,
      tokenB: null,
      amountB: null
    }
  },
  computed: {
    currentPairAddress() {
      if (this.tokenA && this.tokenB) {
        return Helper.getPair(this.tokenA, this.tokenB).pairAddress
      }
      return null
    },
    ratio() {
      console.log(this.reserves)
      return this.reserves.reserve0 / this.reserves.reserve1
    },
  },
  methods: {
    handleTokenSelectAndInput({ selectedToken, amount, id }) {

      if (id == "1") {
        this.tokenA = selectedToken
        this.amountA = amount
        if (this.tokenA && this.tokenB) {

          this.amountB = this.tokenA.name < this.tokenB.name ? this.amountA / this.ratio : this.amountA * this.ratio
          console.log(this.ratio)
        }
      } else if (id == "2") {
        this.tokenB = selectedToken
        this.amountB = amount
        if (this.tokenA && this.tokenB) {
          this.amountA = this.tokenA.name < this.tokenB.name ? this.amountB * this.ratio : this.amountB / this.ratio
        }
      }

    },
    handlePasswordInput(pass: string) {
      this.handleAdd(pass)
    },
    async handleAdd(password: string) {
      if (this.tokenA && this.amountA && this.tokenB && this.amountB) {
        this.isAdding = true
        const res: HttpResponse = await this.$store.dispatch("addLiquidity", [this.tokenA, this.amountA, this.tokenB, this.amountB, password])
        notification.open({
          message: "Notification",
          description: res.result.toString(),
          duration: 0
        })
        this.isAdding = false
      }
    }
  },
  watch: {
    tokenA() {
      if (this.tokenA && this.tokenB) {
         this.getReserves(this.currentPairAddress)
      }
    },
    tokenB() {
      if (this.tokenA && this.tokenB) {
        //this.getReserves(this.currentPairAddress)
      }
    }
  }
})