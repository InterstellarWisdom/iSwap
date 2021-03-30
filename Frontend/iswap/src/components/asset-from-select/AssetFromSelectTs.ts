import { defineComponent, ref } from "vue"
import AssetList from "@/components/asset-list/AssetList.vue"
import { Token } from "@/interfaces/Token";
import useModal from "@/composables/useModal"
export const AssetFromSelectTs = defineComponent({
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
  methods: {
    handleTokenSelect(token: Token) {
      console.log(token)
      this.handleOk()
    },
    assetSelectToggle() {
      this.showModal()
    }
  }
})