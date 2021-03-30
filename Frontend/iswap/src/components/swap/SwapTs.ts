import { defineComponent } from "vue"
import SlidePointSelect from "@/components/slide-point-select/SlidePointSelect.vue"
import AssetFromSelect from "@/components/asset-from-select/AssetFromSelect.vue"
import AssetToSelect from "@/components/asset-to-select/AssetToSelect.vue"

export const SwapTs = defineComponent({
  components: {
    SlidePointSelect,
    AssetFromSelect,
    AssetToSelect
  },
  data() {
    return {

    }
  },
  methods: {
    assetSelectToggle() {
      this.$store.commit("openModal", "AssetSelectModal")
    }
  }
})