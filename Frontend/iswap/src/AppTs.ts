import { defineComponent } from "vue"
import Account from "@/components/account/Account.vue";
export const AppTs = defineComponent({
  components: {
    Account
  },
  mounted() {
    this.$store.dispatch("initialize")
  }
})