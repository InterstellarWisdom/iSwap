import { defineComponent } from "vue"
import BackupModal from "@/components/backup-modal/BackupModal.vue"
import { ref } from "vue"
export const MoreTs = defineComponent({
  setup() {
    const visible = ref<boolean>(false)
    return {
      visible
    }
  },
  components: {
    BackupModal
  }
})