import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import AccountConnectForm from "@/components/account-connect-form/AccountConnectForm.vue";
import TokenBalance from "@/components/token-balance/TokenBalance.vue";
import AddressDisplay from "@/components/ui/address-display/AddressDisplay.vue";
export const AccountTs = defineComponent({
  components: {
    AccountConnectForm,
    TokenBalance,
    AddressDisplay
  },
  computed: {
    ...mapGetters([
      'address'
    ])
  },
  data() {
    return {
      amount: 0,
      isConnecting: false
    }
  },
  methods: {
    connect() {
      this.isConnecting = true
    },
    handleAccountConnect(isConnecting: boolean) {
      this.isConnecting = isConnecting
    }
  }
})