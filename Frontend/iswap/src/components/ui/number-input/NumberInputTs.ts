import { defineComponent } from "vue"
export const NumberInputTs = defineComponent({
  data() {
    return {
      initialVal: 0
    }
  },
  methods:{
    test(e){
      console.log(e)
    }
  },
  computed: {
    numberVal: {
      get(): number {
        return this.initialVal
      },
      set(newVal: string) {
        if (newVal.match(/^[0-9]+(.[0-9]{1,3})?$/)) {
          this.initialVal = newVal
        }
      }
    }
  }
})