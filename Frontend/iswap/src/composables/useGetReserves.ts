import { Http } from "@/backend/Http"
import { onMounted, reactive, ref } from "vue"

export default function useGetReserves() {
  const reserves = reactive({reserve0:null,reserve1:null})
  const getReserves = async (pairAddress: string) => {
    const res = await Http.getReserves(pairAddress)
    reserves.reserve0 = res.result.reserve0
    reserves.reserve1=res.result.reserve1
    return res.result
  }

  return {
    getReserves,
    reserves,
  }
}