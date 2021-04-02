
export class Token {
  symbol: string
  name: string
  address: string
  icon: string
  type: string
  constructor(symbol: string, name: string, address: string, icon: string, type: string) {
    this.symbol = symbol
    this.name = name
    this.address = address
    this.icon = icon
    this.type = type
  }
}