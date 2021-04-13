import { defineComponent, ref } from "vue"
export const RemoveLiquidityFormTs = defineComponent({
  setup() {
    const value = ref(30)
    const setSlider = (val: number) => {
      value.value = val
    }
    return {
      value,
      setSlider
    }
  }
})