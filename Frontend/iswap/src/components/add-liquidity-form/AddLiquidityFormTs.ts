import { defineComponent } from "vue"
import TokenSelectAndInput from "@/components/token-select-and-input/TokenSelectAndInput.vue"
export const AddLiquidityFormTs = defineComponent({
  components: {
    TokenSelectAndInput
  },
  data() {
    return {
      isAdding: false
    }
  }
})