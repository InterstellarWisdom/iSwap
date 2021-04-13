import { HttpResponse } from "@/interfaces/HttpResponse";
import { defineComponent } from "vue";
export const TokenBalanceTs = defineComponent({
  props: {
    contractAddress: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      balance: "0"
    }
  },
  methods: {
    async getBalance() {
      let res: HttpResponse
      if (this.contractAddress) {
        res = await this.$store.dispatch("getTokenBalance", this.contractAddress)
      } else {
        res = await this.$store.dispatch("getNulsBalance")
      }
      this.balance = res.result
    }
  },
  mounted() {
    this.getBalance()
    setInterval(() => {
      this.getBalance()
    }, 10000)
  },
  watch: {
    contractAddress(newAddress) {
      if (newAddress) {
        this.getBalance()
      }
    }
  }
})