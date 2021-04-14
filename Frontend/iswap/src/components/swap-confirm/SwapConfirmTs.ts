
import { defineComponent } from "vue"
import { mapGetters } from "vuex"
import { message, notification } from "ant-design-vue"
import { HttpResponse } from "@/interfaces/HttpResponse"
import PasswordFormModal from "@/components/password-form-modal/PasswordFormModal.vue"
import PairRatio from "@/components/pair-ratio/PairRatio.vue";
export const SwapConfirmTs = defineComponent({
  components: {
    PasswordFormModal,
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
    }
  },
  methods: {
    closeModal() {
      this.$emit("onSwapConfirm", false)
    },
    handlePassInput(pass: string) {
      this.confirmSwap(pass)
    },
    async confirmSwap(password: string) {
      this.isSwapping = true
      const res: HttpResponse = await this.$store.dispatch("confirmSwap", password)
      this.isSwapping = false
      if (res.isSuccess) {
        notification.open({
          message: "Notification",
          description: res.result.txHash,
          duration: 0
        })
      } else {
        notification.open({
          message: "Notification",
          description: res.result.message,
          duration: 0
        })
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