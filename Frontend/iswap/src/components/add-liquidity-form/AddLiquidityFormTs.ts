import { defineComponent } from "vue"
import TokenSelectAndInput from "@/components/token-select-and-input/TokenSelectAndInput.vue"
import PasswordFormModal from "@/components/password-form-modal/PasswordFormModal.vue";
import { notification } from "ant-design-vue"
import { HttpResponse } from "@/interfaces/HttpResponse"
export const AddLiquidityFormTs = defineComponent({
  components: {
    TokenSelectAndInput,
    PasswordFormModal
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
  methods: {
    handleTokenSelectAndInput({ selectedToken, amount, id }) {
      if (id == "1") {
        this.tokenA = selectedToken
        this.amountA = amount
      } else if (id == "2") {
        this.tokenB = selectedToken
        this.amountB = amount
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
  }
})