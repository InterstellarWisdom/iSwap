import { defineComponent } from "vue"
import NumberInput from "@/components/number-input/NumberInput.vue"
export const SlidePointSelectTs = defineComponent({
  components: {
    NumberInput
  },
  data() {
    return {
      /**
       *  1 is 1%
       *  2 is 2%
       *  3 is custom
       */
      currentSlide: 2
    }
  },
  methods: {
    handleSlideToggle(slideNum: number) {
      this.currentSlide = slideNum
    }
  }
})