import { defineComponent } from "vue"
import SlidePointSelect from "@/components/slide-point-select/SlidePointSelect.vue"
import AssetSelectModal from "@/components/asset-select-modal/AssetSelectModal.vue"
export const SwapTs = defineComponent({
  components: {
    SlidePointSelect,
    AssetSelectModal
  },
  data() {
    return {
      isSelecting: false
    }
  },
  methods: {
    assetSelectToggle() {
      this.$store.commit("openModal", "AssetSelectModal")
    }
  }
})