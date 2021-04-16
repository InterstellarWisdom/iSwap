import { HttpResponse } from "@/interfaces/HttpResponse";
import { defineComponent } from "vue";
import wnuls from "@/assets/configs/wnuls.json"
import { mapGetters } from "vuex";
export const TokenBalanceTs = defineComponent({
  props: {
    contractAddress: {
      type: String,
      required: false,
      default: ""
    },
    isInfinity: {
      required: false,
      default: false
    }
  },
  data() {
    return {
      balance: "0"
    }
  },
  computed: {
    ...mapGetters([
      "nulsAmount"
    ])
  },
  methods: {
    async getBalance() {
      let res: HttpResponse
      if (this.contractAddress === wnuls.address) {
        this.balance = this.nulsAmount
        return
      }
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
    if (this.isInfinity) {
      setInterval(() => {
        this.getBalance()
      }, 10000)
    }
  },
  watch: {
    contractAddress(newAddress) {
      if (newAddress) {
        this.getBalance()
      }
    }
  }
})