import { defineComponent } from "vue"
import SlidePointSelect from "@/components/slide-point-select/SlidePointSelect.vue"
import AssetFromSelect from "@/components/asset-from-select/AssetFromSelect.vue"
import AssetToSelect from "@/components/asset-to-select/AssetToSelect.vue"
import SwapConfirm from "@/components/swap-confirm/SwapConfirm.vue"
import { mapGetters } from "vuex"
import { message } from "ant-design-vue"

export const SwapTs = defineComponent({
  computed: {
    ...mapGetters([
      'swapParams',
    ])
  },
  components: {
    SlidePointSelect,
    AssetFromSelect,
    AssetToSelect,
    SwapConfirm,
  },
  data() {
    return {
      //是否正在获取报价
      isGettingQuote: false,
      isShowSwapConfirm: false
    }
  },
  methods: {
    assetSelectToggle() {
      this.$store.commit("openModal", "AssetSelectModal")
    },
    async handleSwap() {
      if (!this.swapParams.amountIn) {
        message.info("请填入交换数量")
        return
      }
      if (!this.swapParams.to) {
        message.info("请选择一个代币")
        return
      }
      this.isGettingQuote = true
      const estimatedAmount = await this.$store.dispatch("reviewSwap")
      this.isGettingQuote = false
      this.isShowSwapConfirm = true
    },

    handleSwapConfirm() {
      this.isShowSwapConfirm = false
    }
  }
})