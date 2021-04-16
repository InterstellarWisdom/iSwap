import { ref } from "vue"

export default function useSlider() {
  const sliderValue = ref(0)
  const setSlider = (val: number) => {
    sliderValue.value = val
  }
  return {
    sliderValue,
    setSlider
  }
}