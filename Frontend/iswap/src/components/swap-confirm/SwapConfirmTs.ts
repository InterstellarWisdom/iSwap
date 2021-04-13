
import { defineComponent } from "vue"
import { mapGetters } from "vuex"
import { message } from "ant-design-vue"
import { HttpResponse } from "@/interfaces/HttpResponse"
import PasswordForm from "@/components/password-form/PasswordForm.vue"
import PairRatio from "@/components/pair-ratio/PairRatio.vue";
export const SwapConfirmTs = defineComponent({
  components: {
    PasswordForm,
    PairRatio
  },
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSwapping: false,
      isInputtingPass: false
    }
  },
  methods: {
    closeModal() {
      this.$emit("onSwapConfirm", false)
    },
    handlePassInput(pass: any) {
      if (pass) {
        this.confirmSwap(pass)
      }
      this.isInputtingPass = false
    },
    async confirmSwap(password: string) {
      this.isSwapping = true
      const res: HttpResponse = await this.$store.dispatch("confirmSwap", password)
      this.isSwapping = false
      if (res.isSuccess) {
        message.info(res.result.txHash)
      } else {
        message.info(res.result.message)
      }

      this.$emit("onSwapConfirm", false)
    }
  },
  computed: {
    ...mapGetters([
      "swapParams"
    ])
  }
})