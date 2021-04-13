import useModal from "@/composables/useModal"
import { defineComponent } from "vue"
import { mapGetters } from "vuex"
import AddressDisplay from "@/components/ui/address-display/AddressDisplay.vue"
import copy from 'copy-to-clipboard';
import { message } from "ant-design-vue";
export const AccountManageModalTs = defineComponent({
  components: {
    AddressDisplay
  },
  setup() {
    const { visible, showModal, handleCancel, handleOk } = useModal()
    return {
      visible, showModal, handleCancel, handleOk
    }
  },
  computed: {
    ...mapGetters([
      "address"
    ])
  },
  methods: {
    copy() {
      copy(this.address)
      message.info("复制成功！")
    }
  }
})