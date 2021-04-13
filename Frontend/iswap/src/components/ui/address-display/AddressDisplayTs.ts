import { toRef, toRefs } from "vue";
import { defineComponent } from "vue";
export const AddressDisplayTs = defineComponent({
  props: {
    address: {
      required: true,
      type: String,
      default: null
    },
    head: {
      required: false,
      type: Number,
      default: 6
    },
    tail: {
      required: false,
      type: Number,
      default: 4
    }
  },
  setup(props) {
    const { address } = toRefs(props)
    const head = toRef(props, "head")
    const tail = toRef(props, "tail")

    const wrappedAddress = `${address.value.substring(0, head.value)}...${address.value.substring(address.value.length - tail.value)}`
    return {
      wrappedAddress
    }
  }
})