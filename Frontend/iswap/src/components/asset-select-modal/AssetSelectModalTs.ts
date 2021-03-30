import { defineComponent, ref } from "vue"
import { mapGetters } from "vuex"
import AssetSelect from "@/components/asset-select/AssetSelect.vue"
export const AssetSelectModalTs = defineComponent({
  components: {
    AssetSelect
  },
  computed: {
    visible() {
      return (this.$store.getters.activeModals as Array<string>).indexOf("AssetSelectModal") > -1
    }
  },
  methods: {
    showModal() {
      this.$store.commit("openModal", "AssetSelectModal")
    },
    handleOk(e: MouseEvent) {
      this.$store.commit("closeModal", "AssetSelectModal")
    },
    handleCancel(e: MouseEvent) {
      this.$store.commit("closeModal", "AssetSelectModal")
    }
  },
})