import { defineComponent, ref } from "vue"
import AssetList from "@/components/asset-list/AssetList.vue"
import { Token } from "@/interfaces/Token";
import useModal from "@/composables/useModal";
import { mapGetters } from "vuex";
export const AssetToSelectTs = defineComponent({
  components: {
    AssetList
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
      selectedToToken: null
    }
  },
  computed: {
    ...mapGetters([
      "swapParams"
    ]),
    toToken: {
      get(): Token {
        return this.selectedToToken
      },
      set(token: Token) {

        this.selectedToToken = token
      }
    }
  },
  methods: {
    assetSelectToggle() {
      this.showModal()
    },
    handleTokenSelect(token: Token) {
      this.toToken = token
      this.$store.commit("setToToken", this.toToken)
      this.handleOk()
    }
  }
})