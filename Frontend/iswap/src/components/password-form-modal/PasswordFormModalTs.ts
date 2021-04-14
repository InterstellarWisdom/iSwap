import useModal from "@/composables/useModal"
import { message } from "ant-design-vue"
import { defineComponent } from "vue"
export const PasswordFormModalTs = defineComponent({
  setup() {
    const { visible, showModal, handleOk, handleCancel } = useModal()
    return {
      visible, showModal, handleOk, handleCancel
    }
  },
  data() {
    return {
      password: ""
    }
  },
  methods: {
    handlePassInput() {
      if (!this.password) {
        return message.info("请输入密码")
      }
      if (this.password.length < 8) {
        return message.info("请输入至少八位密码")
      }
      this.$emit("on-password-input", this.password)
      this.handleCancel()
    }
  }
})