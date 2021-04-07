import { Token } from "@/interfaces/Token";
import { defineComponent } from "vue";
import AssetList from "@/components/asset-list/AssetList.vue"
import useModal from "@/composables/useModal";

export const TokenSelectAndInputTs = defineComponent({
  components: {
    AssetList
  },
  props: {
    initialToken: {
      required: false,
      type: Token,
      default: null
    },
    id: {
      required: false,
      type: String,
      default: null
    }
  },
  setup() {
    const { visible, showModal, handleOk, handleCancel } = useModal()
    return {
      visible,
      showModal,
      handleOk,
      handleCancel
    };
  },
  data() {
    return {
      amountInput: null,
      selectedToken: null
    }
  },
  methods: {
    handleTokenSelect(token: Token) {
      this.selectedToken = token
      this.$emit("on-token-select-and-input", { selectedToken: this.selectedToken, amount: this.amountInput, id: this.id })
      this.handleOk()
    },
    assetSelectToggle() {
      this.showModal()
    },
    handleInput(e: InputEvent) {
      this.amountInput = e.currentTarget["value"]
      this.$emit("on-token-select-and-input", { selectedToken: this.selectedToken, amount: this.amountInput, id: this.id })
    }
  },
  mounted() {
    this.selectedToken = this.initialToken
    this.$emit("on-token-select-and-input", { selectedToken: this.selectedToken, amount: this.amountInput, id: this.id })
  }
})