
import { defineComponent } from "vue"
import { mapGetters } from "vuex"
import { message } from "ant-design-vue"
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
      const res = await this.$store.dispatch("confirmSwap")
      this.isSwapping = false
      message.info(res.txHash)
      this.$emit("onSwapConfirm", false)
    }
  },
  computed: {
    ...mapGetters([
      "swapParams"
    ])
  }
})