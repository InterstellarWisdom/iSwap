import { HttpResponse } from "@/interfaces/HttpResponse";
import { message, notification } from "ant-design-vue";
import { defineComponent, ref } from "vue";

export const AccountConnectFormTs = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  setup() {
    const password = ref<string>("")
    const plainPriKey = ref<string>("")
    return {
      password,
      plainPriKey
    }
  },
  data() {
    return {
      /**
       * "create" or "import"
       */
      connectType: "import",
      isConnecting: false
    }
  },
  methods: {
    closeModal() {
      this.$emit("onAccountConnect", false)
    },
    connectTypeToggle(type: string) {
      this.connectType = type
    },
    async handleAccountConnect() {
      if (!this.password) {
        message.info("请输入密码")
        return
      }
      if (this.connectType === "import" && !this.plainPriKey) {
        message.info("请输入私钥")
        return
      }
      let res: HttpResponse
      this.isConnecting = true
      try {
        if (this.connectType === "import") {
          res = await this.$store.dispatch("importPrivateKey", [this.plainPriKey, this.password])
        } else if (this.connectType === "create") {
          res = await this.$store.dispatch("createAccount", this.password)
        }
        notification.open({
          message: "Notification",
          description: res.result,
          duration: 0
        })
        this.closeModal()
      } finally {
        this.isConnecting = false
      }
    }
  }
})