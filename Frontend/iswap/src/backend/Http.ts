import { Error } from "@/helper/Error"
import { HttpResponse } from "@/interfaces/HttpResponse"
import { NetworkResponse } from "@/interfaces/NetworkResponse"
import axios, { AxiosResponse } from "axios"

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
  async authorizedToRouterContract(authorizer: string, toBeAuthorizedAmount: number): Promise<HttpResponse> {
    const res = await this.callContract(authorizer, "approve", [this.routerContractAddress, toBeAuthorizedAmount])
    return {
      isSuccess: res.isSuccess,
      result: res.result.data
    }
  }

  async getEstimatedOutMount(amountIn: number, path: Array<string>): Promise<HttpResponse> {
    const res = await this.invokeView(this.routerContractAddress, "getAmountsOut", "(BigInteger amountIn, String[] path) return Ljava/util/HashMap;", [amountIn, path])
    let estimatedAmount = null
    if (res.isSuccess) {
      estimatedAmount = res.result.data['result'].match(/1=.*/)[0].slice(2, -1)
    }
    return {
      isSuccess: res.isSuccess,
      result: res.isSuccess ? estimatedAmount : res.result.message
    }
  }
  async swapTokenToToken(amountIn: number, amountOutMin: number, path: string[], to: string): Promise<HttpResponse> {
    const firstRes = await this.callContract(this.routerContractAddress, "swapExactTokensForToken", [amountIn, amountOutMin, path, to])
    if (firstRes.isSuccess) {
      return { isSuccess: firstRes.isSuccess, result: firstRes.result.data }
    } else {
      const msg = firstRes.result.message
      if (msg.search(Error.INSUFFICIENT_APPROVED_TOKEN) > -1) {
        const res = await this.authorizedToRouterContract(path[0], amountIn)
        if (!res.isSuccess) {
          return res
        }
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve(null)
            }, 2000);
          })
          const swapRes = await this.callContract(this.routerContractAddress, "swapExactTokensForToken", [amountIn, amountOutMin, path, to])
          if (swapRes.isSuccess) {
            return {
              isSuccess: swapRes.isSuccess,
              result: swapRes.result.data
            }
          }
        }
      }
    }
  }
  swapNulsToToken(amountOutMin: number, path: string[], to: string, deadline?: string): Promise<HttpResponse> {
    return this.callContract(this.routerContractAddress, "swapExactNULSForTokens", [amountOutMin, path, to])

  }
  swapTokenToNuls() {
    //
  }
  private async callContract(contract: string, method: string, methodParams: Array<any>): Promise<NetworkResponse> {
    const axiosRes = await axios.post(this.BASE_URL, {
      "id": "1234",
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
    return this.handleAxiosRes(axiosRes)
  }
  private async invokeView(contract: string, methodName: string, methodDesc: string, methodParams: Array<any>): Promise<NetworkResponse> {
    const axiosRes = await axios.post(this.BASE_URL, {
      "id": "1234",
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

    return this.handleAxiosRes(axiosRes)
  }
  private handleAxiosRes(axiosRes: AxiosResponse): NetworkResponse {
    const res: NetworkResponse = {
      isSuccess: null,
      result: {
        message: null,
        data: null,
        code: null,
        id: null,
        jsonrpc: null
      }
    }

    if (axiosRes.status === 200) {
      const data = axiosRes.data
      res.result.jsonrpc = data.jsonrpc
      res.result.id = data.id
      if (data.error) {
        res.result.message = data.error.message
        res.result.data = data.error.data
        res.result.code = data.error.code
        res.isSuccess = false
      } else {
        if (data.result) {
          if (data.result.success === false) {
            res.isSuccess = false
            res.result.message = data.result.msg
            res.result.code = data.result.code
          } else {
            res.isSuccess = true
            res.result.data = data.result
          }

        } else {
          res.isSuccess = false
          res.result.message = "UnException Error"
        }
      }
    } else {
      res.isSuccess = false
      res.result.message = "Network error!"
    }
    return res
  }
}
