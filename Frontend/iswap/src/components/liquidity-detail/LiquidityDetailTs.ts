import { LiquidityInfo } from "@/interfaces/LiquidityInfo";
import { defineComponent } from "vue";
export const LiquidityDetailTs=defineComponent({
  props:{
    liquidityInfo:{
      type:LiquidityInfo,
      required:true,
      default:null
    }
  }
})