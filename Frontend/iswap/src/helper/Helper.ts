export class Helper {
  static handleAccuracy(num: string, accuracy: number): string {
    if (num === "0") {
      return "0.00"
    }
    const length = num.length
    const intFrag = num.substring(0, length - accuracy)
    const decimalFrag = num.substring(-accuracy)
    return `${intFrag}.${decimalFrag}`
  }
}