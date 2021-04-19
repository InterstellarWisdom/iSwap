import { Token } from "@/interfaces/Token"
import pairs from "@/assets/configs/pairs.json"
export class Helper {
  static handleAccuracy(num: string, accuracy: number): string {
    if (num === "0") {
      return "0.00"
    }
    const length = num.length
    const intFrag = num.substring(0, length - accuracy)
    const decimalFrag = num.substring(-accuracy).substring(0, 6)
    return `${intFrag}.${decimalFrag}`
  }
  static getPair(tokenA: Token, tokenB: Token) {
    const pair = pairs.find((pair) => {
      if (pair.pairContracts.addressA === tokenA.address || pair.pairContracts.addressA === tokenB.address) {
        if (pair.pairContracts.addressB === tokenB.address || pair.pairContracts.addressB === tokenA.address) {
          return pair
        }
      }
    })
    return pair
  }
}