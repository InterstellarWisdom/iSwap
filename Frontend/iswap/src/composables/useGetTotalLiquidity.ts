import { Http } from "@/backend/Http"
import { onMounted, ref } from "vue"

export default function useGetTotalLiquidity(pairAddress: string) {
  const totalLiquidity = ref('')
  const getTotalLiquidity = async () => {
    const res = await Http.getTotalSupply(pairAddress)
    totalLiquidity.value = res.result
    return res
  }
  onMounted(getTotalLiquidity)
  return {
    getTotalLiquidity,
    totalLiquidity
  }
}