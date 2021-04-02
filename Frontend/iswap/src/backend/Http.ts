import { Error } from "@/helper/Error"
import axios from "axios"

export class Http {
  private BASE_URL = "http://beta.api.nuls.io/jsonrpc"
  /**
   * 1:MAIN NET
   * 2:TEST NET
   */
  private chainId = 2
  /**
   * the caller address
   */
  private sender = "tNULSeBaMjuwkLhA7iqex8Q3Umrznd62xJwvaJ"
  /**
   * the caller password
   */
  private password = "lj2350525"
  /**
   * Main network asset amount to be transferred in 
   * 0: there is no this business
   */
  private mainNetworkAssetAmount = 0
  /**
   * the gas limit
   */
  private gasLimit = 2000000
  /**
   * the gas unit price
   */
  private gasPrice = 3000
  /**
   * the router contract address
   */
  private routerContractAddress = "tNULSeBaMyUL278roMnG33gpaEbDZmAejjJCBW"

  /**
   * @description:  使路由合约拥有交换一定数量的授权token的权利
   * @param {string} authorizer 授权的token地址
   * @param {string} routerContractAddress 接受授权的路由合约地址
   * @param {number} toBeAuthorizedAmount 准备授权的token数量
   * @return {*}
   */
  async authorizedToRouterContract(authorizer: string, toBeAuthorizedAmount: number): Promise<any> {
    const res = await this.callContract(authorizer, "approve", [this.routerContractAddress, toBeAuthorizedAmount])
    return res.result
  }

  async getEstimatedOutMount(amountIn: number, path: Array<string>): Promise<string> {
    const res = await this.invokeView(this.routerContractAddress, "getAmountsOut", "(BigInteger amountIn, String[] path) return Ljava/util/HashMap;", [amountIn, path])
    const estimatedMount = res.result.result.match(/1=.*/)[0].slice(2, -1)
    if (estimatedMount) {
      return estimatedMount
    }
    return res.result
  }
  async swapTokenToToken(amountIn: number, amountOutMin: number, path: string[], to: string): Promise<any> {
    const firstRes = await this.callContract(this.routerContractAddress, "swapExactTokensForToken", [amountIn, amountOutMin, path, to])
    if (firstRes.result && firstRes.result.success === false) {
      const msg = firstRes.result.msg
      if (msg.search(Error.INSUFFICIENT_APPROVED_TOKEN) > -1) {
        const res = await this.authorizedToRouterContract(path[0], amountIn)
        if (res.success === false) {
          return res.msg
        } else {
          return this.swapTokenToToken(amountIn, amountOutMin, path, to)
        }
      }
    } else {
      return firstRes.result
    }


  }
  swapNulsToToken(amountOutMin: number, path: string[], to: string, deadline?: string): Promise<any> {
    return this.callContract(this.routerContractAddress, "swapExactNULSForTokens", [amountOutMin, path, to])

  }
  swapTokenToNuls() {
    //
  }
  private async callContract(contract: string, method: string, methodParams: Array<any>): Promise<any> {
    const res = await axios.post(this.BASE_URL, {
      "jsonrpc": "2.0",
      "method": "contractCall",
      "params": [
        this.chainId,
        this.sender,
        this.password,
        this.mainNetworkAssetAmount,
        this.gasLimit,
        this.gasPrice,
        contract,
        method,
        "",
        methodParams,
        "",
        []
      ]
    })
    if (res.status === 200) {
      return res.data
    }
    throw res.statusText
  }
  private async invokeView(contract: string, methodName: string, methodDesc: string, methodParams: Array<any>) {
    const res = await axios.post(this.BASE_URL, {
      "jsonrpc": "2.0",
      "method": "invokeView",
      "params": [
        this.chainId,
        contract,
        methodName,
        methodDesc,
        methodParams,
      ]
    })
    if (res.status === 200) {
      return res.data
    }
    throw res.statusText
  }
}