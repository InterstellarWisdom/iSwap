import { Http } from "@/backend/Http"
import { onMounted, ref } from "vue"

export default function useGetReserves(pairAddress: string) {
  const reserves = ref({})
  const getReserves = async () => {
    const res = await Http.getReserves(pairAddress)
    reserves.value = res.result
    return res.result
  }
  onMounted(getReserves)
  return {
    getReserves,
    reserves
  }
}