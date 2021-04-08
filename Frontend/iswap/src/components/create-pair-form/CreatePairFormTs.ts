import { defineComponent } from "vue"
import { mapGetters } from "vuex"
import { HttpResponse } from "@/interfaces/HttpResponse"
import { notification } from "ant-design-vue"
import TokenSelectAndInput from "@/components/token-select-and-input/TokenSelectAndInput.vue"
import PasswordForm from "@/components/password-form/PasswordForm.vue"
export const CreatePairFormTs = defineComponent({
  components: {
    TokenSelectAndInput,
    PasswordForm
  },
  data() {
    return {
      isCreating: false,
      isInputtingPass: false,
      tokenA: null,
      amountA: null,
      tokenB: null,
      amountB: null
    }
  },
  computed: {
    ...mapGetters([
      "originalToken"
    ])
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
    handlePasswordInput(pass: string | boolean) {
      if (pass) {
        this.createPair(pass)
      }
      this.isInputtingPass = false
    },
    async createPair(password: string) {
      if (this.tokenA && this.amountA && this.tokenB && this.amountB) {
        this.isCreating = true
        const res: HttpResponse = await this.$store.dispatch("createPair", [this.tokenA, this.amountA, this.tokenB, this.amountB, password])
        notification.open({
          message: "Notification",
          description:
            res.result.toString(),
          duration: 0,
        });
        this.isCreating = false
      }
    }
  }
})