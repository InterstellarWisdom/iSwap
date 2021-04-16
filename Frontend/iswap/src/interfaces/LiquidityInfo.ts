export class LiquidityInfo {
  name: string
  desc: string
  pairAddress: string
  liquidity: string
  pairContracts: {
    tokenA: string,
    addressA: string,
    tokenB: string,
    addressB: string
  }
}