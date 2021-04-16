import useModal from "@/composables/useModal";
import { defineComponent } from "vue";

export const BackupModalTs = defineComponent({
  setup() {
    const { visible, showModal, handleCancel, handleOk } = useModal()
    return {
      visible, showModal, handleCancel, handleOk
    }
  }
})