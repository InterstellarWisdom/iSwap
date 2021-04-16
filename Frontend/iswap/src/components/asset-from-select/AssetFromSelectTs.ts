import { defineComponent, ref } from "vue"
import AssetList from "@/components/asset-list/AssetList.vue"
import TokenBalance from "@/components/token-balance/TokenBalance.vue"
import { Token } from "@/interfaces/Token";
import useModal from "@/composables/useModal"
import { mapGetters } from "vuex";
export const AssetFromSelectTs = defineComponent({
  components: {
    AssetList,
    TokenBalance
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
      selectedFromToken: null,
      amountIn: null
    }
  },
  computed: {
    ...mapGetters([
      "originalToken",
      "swapParams"
    ]),
    fromToken: {
      get() {
        return this.selectedFromToken ? this.selectedFromToken : this.originalToken
      },
      set(token: Token) {
        this.selectedFromToken = token
      }
    },
  },
  methods: {
    handleTokenSelect(token: Token) {
      this.fromToken = token
      this.$store.commit("setFromToken", this.fromToken)
      this.handleOk()
    },
    assetSelectToggle() {
      this.showModal()
    },
    handleInput(e: InputEvent) {
      this.amountIn = e.currentTarget["value"]
      this.$store.commit("setAmountIn", this.amountIn)
    }
  },
  mounted() {
    this.$store.commit("setFromToken", this.fromToken)
  }
})