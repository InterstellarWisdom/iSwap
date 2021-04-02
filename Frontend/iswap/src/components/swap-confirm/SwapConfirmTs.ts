
import { defineComponent } from "vue"
import { mapGetters } from "vuex"
import { message } from "ant-design-vue"
import { HttpResponse } from "@/interfaces/HttpResponse"
export const SwapConfirmTs = defineComponent({
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSwapping: false
    }
  },
  methods: {
    closeModal() {
      this.$emit("onSwapConfirm", false)
    },
    async confirmSwap() {
      this.isSwapping = true
      const res: HttpResponse = await this.$store.dispatch("confirmSwap")
      this.isSwapping = false
      message.info(res.result.txHash)
      this.$emit("onSwapConfirm", false)
    }
  },
  computed: {
    ...mapGetters([
      "swapParams"
    ])
  }
})