
export class Token {
  symbol: string
  name: string
  address: string
  icon: string
  type: string
  decimals: number
  constructor(symbol: string, name: string, address: string, icon: string, type: string, decimals: number) {
    this.symbol = symbol
    this.name = name
    this.address = address
    this.icon = icon
    this.type = type
    this.decimals = decimals
  }
}