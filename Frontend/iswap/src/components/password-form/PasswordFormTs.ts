import { message } from "ant-design-vue"
import { defineComponent } from "vue"
export const PasswordFormTs = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data() {
    return {
      password: ""
    }
  },
  methods: {
    closeModal() {
      this.$emit("on-password-input", false)
    },
    handlePassInput() {
      if (!this.password) {
        return message.info("请输入密码")
      }
      if (this.password.length < 8) {
        return message.info("请输入至少八位密码")
      }
      this.$emit("on-password-input", this.password)
    }
  }
})