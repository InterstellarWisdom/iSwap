import { Error } from "@/helper/Error"
import { HttpResponse } from "@/interfaces/HttpResponse"
import { NetworkResponse } from "@/interfaces/NetworkResponse"
import axios, { AxiosResponse } from "axios"
import pairHex from "@/assets/configs/pair-hex.json"
import { Token } from "@/interfaces/Token"
import { Helper } from "@/helper/Helper"

export class Http {
  private static BASE_URL = "http://beta.api.nuls.io/jsonrpc"
  /**
   * 1:MAIN NET
   * 2:TEST NET
   */
  private static chainId = 2
  /**
   * the caller address
   */
  private sender: string
  /**
   * the caller password
   */
  private password: string
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
  private static routerContractAddress = "tNULSeBaN797eRQbAZWUZePtXo4smEdLb7s79Y"
  /**
   * the factory contract address
   */
  private static factoryContractAddress = "tNULSeBaMzfzMDR1ZLZwGUBHsZEY8EhC9ke1a6"
  constructor(address: string, password: string) {
    this.sender = address
    this.password = password
  }
  /**
   * @description:  使路由合约拥有交换一定数量的授权token的权利
   * @param {string} authorizer 授权的token地址
   * @param {string} routerContractAddress 接受授权的路由合约地址
   * @param {number} toBeAuthorizedAmount 准备授权的token数量
   * @return {*}
   */
  async authorizedToRouterContract(authorizer: string, toBeAuthorizedAmount: number): Promise<HttpResponse> {
    const res = await this.callContract(authorizer, "approve", [Http.routerContractAddress, toBeAuthorizedAmount])
    return {
      isSuccess: res.isSuccess,
      result: res.result.data
    }
  }

  static async getEstimatedOutMount(amountIn: number, path: Array<string>): Promise<HttpResponse> {
    const res = await Http.invokeView(this.routerContractAddress, "getAmountsOut", "(BigInteger amountIn, String[] path) return Ljava/util/HashMap;", [amountIn, path])
    let estimatedAmount = null
    if (res.isSuccess) {
      estimatedAmount = res.result.data['result'].match(/1=.*/)[0].slice(2, -1)
    }
    return {
      isSuccess: res.isSuccess,
      result: res.isSuccess ? estimatedAmount : res.result.message
    }
  }
  async swapTokenToToken(amountIn: number, amountOutMin: number, path: string[], to: string, deadline = "100000000000"): Promise<HttpResponse> {
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
      const swapRes = await this.callContract(Http.routerContractAddress, "swapExactTokensForToken", [amountIn, amountOutMin, path, to, deadline])
      if (swapRes.isSuccess) {
        return {
          isSuccess: swapRes.isSuccess,
          result: swapRes.result.data
        }
      }
    }
    return {
      isSuccess: false,
      result: Error.NETWORK_ERROR
    }
  }
  async swapNulsToToken(nulsAmount: number, amountOutMin: number, path: string[], to: string, deadline = "10000000000000"): Promise<HttpResponse> {
    const methodDesc = "(BigInteger amountOutMin, String[] path, Address to, long deadline) return Ljava/util/HashMap;"
    const res = await this.callContract(Http.routerContractAddress, "swapExactNULSForTokens", [amountOutMin, path, to, deadline], methodDesc, Math.pow(10, 9) * parseFloat(nulsAmount.toString()))
    return {
      isSuccess: res.isSuccess,
      result: res.result.data
    }

  }
  async swapTokenToNuls(amountIn: number, amountOutMin: number, path: string[], to: string, deadline = "10000000000000"): Promise<HttpResponse> {
    const res = await this.callContract(Http.routerContractAddress, "swapTokensForExactNULS", [amountIn, amountOutMin, path, to, deadline])
    return {
      isSuccess: res.isSuccess,
      result: res.result.data
    }
  }
  async deployPair(): Promise<HttpResponse> {
    const contractCode = pairHex
    const alias = "pair1"
    const res = await this.createContract(alias, contractCode, [Http.factoryContractAddress])
    return {
      isSuccess: res.isSuccess,
      result: res.result.data
    }
  }
  async createPair(addressA: string, addressB: string): Promise<HttpResponse> {
    const checkRes = await Http.checkPair(addressA, addressB)
    if (checkRes.isSuccess) {
      return {
        isSuccess: false,
        result: Error.PAIR_IS_EXISTED
      }
    }
    const deployRes = await this.deployPair()
    if (!deployRes.isSuccess) {
      return {
        isSuccess: false,
        result: deployRes.result
      }
    }
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 2000);
      })
      const contractAddress = deployRes.result.contractAddress
      const callRes = await this.callContract(Http.factoryContractAddress, "createPair", [contractAddress, addressA, addressB])
      if (callRes.isSuccess) {
        return {
          isSuccess: callRes.isSuccess,
          result: callRes.isSuccess ? callRes.result.data : callRes.result.message
        }
      }

    }
    return {
      isSuccess: false,
      result: Error.NETWORK_ERROR
    }
  }
  async addLiquidityNuls(nulsAmount: string, token: Token, tokenAmount: string): Promise<HttpResponse> {
    const authRes = await this.authorizedToRouterContract(token.address, parseFloat(tokenAmount))
    if (!authRes.isSuccess) {
      return {
        isSuccess: false,
        result: `${token.symbol} 授权失败`
      }
    }
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 2000);
      })
      const callRes = await this.callContract(Http.routerContractAddress, "addLiquidityNUlS", [token.address, tokenAmount, tokenAmount, nulsAmount, this.sender, "100000000000"], "", parseFloat(nulsAmount))
      if (callRes.isSuccess) {
        return {
          isSuccess: callRes.isSuccess,
          result: callRes.isSuccess ? callRes.result.data : callRes.result.message
        }
      }

    }
    return {
      isSuccess: false,
      result: Error.NETWORK_ERROR
    }
  }
  async addLiquidity(tokenA: Token, amountA: string, tokenB: Token, amountB: string): Promise<HttpResponse> {
    const authResA = await this.authorizedToRouterContract(tokenA.address, parseFloat(amountA))
    if (!authResA.isSuccess) {
      return {
        isSuccess: false,
        result: `${tokenA.symbol} 授权失败`
      }
    }
    const authResB = await this.authorizedToRouterContract(tokenB.address, parseFloat(amountB))
    if (!authResB.isSuccess) {
      return {
        isSuccess: false,
        result: `${tokenB.symbol} 授权失败`
      }
    }
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 2000)
      })
      const callRes = await this.callContract(Http.routerContractAddress, "addLiquidity", [tokenA.address, tokenB.address, amountA, amountB, amountA, amountB, this.sender, "100000000000"])
      if (callRes.isSuccess) {
        return {
          isSuccess: callRes.isSuccess,
          result: callRes.isSuccess ? callRes.result.data.txHash : callRes.result.message
        }
      } else {
        if (callRes.result.message.indexOf(Error.CONTRACT_ERROR) > -1) {
          return {
            isSuccess: callRes.isSuccess,
            result: callRes.result.message
          }
        }
      }
    }
    return {
      isSuccess: false,
      result: Error.NETWORK_ERROR
    }
  }
  static async checkPair(addressA: string, addressB: string): Promise<HttpResponse> {
    const res = await Http.invokeView(Http.factoryContractAddress, "getPairAddress", "", [addressA, addressB])
    return {
      isSuccess: res.isSuccess,
      result: res.isSuccess ? res.result.data : res.result.message
    }
  }
  async removeLiquidity(liquidity: string, tokenA: Token, amountA: string, tokenB: Token, amountB: string, deadline = "100000000000"): Promise<HttpResponse> {
    const _amountA = Math.floor(parseFloat(amountA))
    const _amountB = Math.floor(parseFloat(amountB))
    const authResA = await this.authorizedToRouterContract(tokenA.address, _amountA)
    if (!authResA.isSuccess) {
      return {
        isSuccess: false,
        result: `${tokenA.symbol} 授权失败`
      }
    }
    const authResB = await this.authorizedToRouterContract(tokenB.address, _amountB)
    if (!authResB.isSuccess) {
      return {
        isSuccess: false,
        result: `${tokenB.symbol} 授权失败`
      }
    }
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 2000)
      })
      console.log(Math.floor(parseFloat(amountA)))
      const callRes = await this.callContract(Http.routerContractAddress, "removeLiquidity", [tokenA.address, tokenB.address, liquidity, _amountA, _amountB, this.sender, deadline])
      if (callRes.isSuccess) {
        return {
          isSuccess: callRes.isSuccess,
          result: callRes.isSuccess ? callRes.result.data : callRes.result.message
        }
      }

    }
    return {
      isSuccess: false,
      result: Error.NETWORK_ERROR
    }
  }
  async removeLiquidityNuls(liquidity: string, nulsAmount: string, token: Token, tokenAmount: string): Promise<HttpResponse> {
    const authRes = await this.authorizedToRouterContract(token.address, parseFloat(tokenAmount))
    if (!authRes.isSuccess) {
      return {
        isSuccess: false,
        result: `${token.symbol} 授权失败`
      }
    }
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 2000)
      })
      const callRes = await this.callContract(Http.routerContractAddress, "removeLiquidityNULS", [token.address, liquidity, tokenAmount, nulsAmount])
      if (callRes.isSuccess) {
        return {
          isSuccess: callRes.isSuccess,
          result: callRes.isSuccess ? callRes.result.data : callRes.result.message
        }
      }
    }
    return {
      isSuccess: false,
      result: Error.NETWORK_ERROR
    }
  }
  private async callContract(contract: string, method: string, methodParams: Array<any>, methodDesc?: string, nulsAmount = 0): Promise<NetworkResponse> {
    const axiosRes = await axios.post(Http.BASE_URL, {
      "id": "1234",
      "jsonrpc": "2.0",
      "method": "contractCall",
      "params": [
        Http.chainId,
        this.sender,
        this.password,
        nulsAmount,
        this.gasLimit,
        this.gasPrice,
        contract,
        method,
        methodDesc,
        methodParams,
        "",
        []
      ]
    })
    return Http.handleAxiosRes(axiosRes)
  }
  private static async invokeView(contract: string, methodName: string, methodDesc: string, methodParams: Array<any>): Promise<NetworkResponse> {
    const axiosRes = await axios.post(Http.BASE_URL, {
      "id": "1234",
      "jsonrpc": "2.0",
      "method": "invokeView",
      "params": [
        Http.chainId,
        contract,
        methodName,
        methodDesc,
        methodParams,
      ]
    })

    return Http.handleAxiosRes(axiosRes)
  }
  private async createContract(contractAlias: string, contractCode: string, args: any[], remark = ""): Promise<NetworkResponse> {
    const axiosRes = await axios.post(Http.BASE_URL, {
      "id": "1234",
      "jsonrpc": "2.0",
      "method": "contractCreate",
      "params": [
        Http.chainId,
        this.sender,
        this.password,
        contractAlias,
        this.gasLimit,
        this.gasPrice,
        contractCode,
        args,
        remark
      ]
    })
    return Http.handleAxiosRes(axiosRes)
  }
  static async createAccount(password: string, count = 1): Promise<HttpResponse> {
    const axiosRes = await axios.post(Http.BASE_URL, {
      "id": "1234",
      "jsonrpc": "2.0",
      "method": "createAccount",
      "params": [Http.chainId, count, password]
    })
    const httpRes = Http.handleAxiosRes(axiosRes)
    return {
      isSuccess: httpRes.isSuccess,
      result: httpRes.isSuccess ? httpRes.result.data[0] : httpRes.result.message
    }
  }
  static async importPrivateKey(privateKey: string, password: string): Promise<HttpResponse> {
    const axiosRes = await axios.post(Http.BASE_URL, {
      "id": "1234",
      "jsonrpc": "2.0",
      "method": "importPriKey",
      "params": [Http.chainId, privateKey, password]
    })
    const httpRes = Http.handleAxiosRes(axiosRes)
    return {
      isSuccess: httpRes.isSuccess,
      result: httpRes.isSuccess ? httpRes.result.data : httpRes.result.message
    }
  }
  static async getNulsBalance(address: string): Promise<HttpResponse> {
    const axiosRes = await axios.post(Http.BASE_URL, {
      "jsonrpc": "2.0",
      "method": "getAccountBalance",
      "params": [2, 2, 1, address],
      "id": 1234
    })
    const httpRes = Http.handleAxiosRes(axiosRes)
    return {
      isSuccess: httpRes.isSuccess,
      result: httpRes.isSuccess ? httpRes.result.data.balance : httpRes.result.message
    }
  }
  static async getTokenBalance(contractAddress: string, address: string): Promise<HttpResponse> {
    const res = await Http.invokeView(contractAddress, "balanceOf", "", [address])
    return {
      isSuccess: res.isSuccess,
      result: res.isSuccess ? res.result.data.result : res.result.message
    }
  }
  static async getTokensBalance(contactAddresses: string[], address: string): Promise<HttpResponse> {
    const resArray = await Promise.all(contactAddresses.map(async (contract) => {
      const res = await Http.getTokenBalance(contract, address)
      return {
        isSuccess: res.isSuccess,
        result: res.isSuccess ? {
          pairAddress: contract,
          liquidity: res.result
        } : null
      }
    }))
    return {
      isSuccess: resArray.every(httpRes => httpRes.isSuccess),
      result: resArray.map(httpRes => httpRes.result)
    }
  }
  static async getTotalSupply(contractAddress: string): Promise<HttpResponse> {
    const res = await Http.invokeView(contractAddress, "totalSupply", "", [])
    return {
      isSuccess: res.isSuccess,
      result: res.isSuccess ? res.result.data.result : res.result.message
    }
  }
  static async getReserves(pairAddress: string): Promise<HttpResponse> {
    const res = await Http.invokeView(pairAddress, "getReserves", "", [])
    const data = { reserve0: null, reserve1: null }
    if (res.isSuccess) {
      (res.result.data.result as string).replaceAll(/[{}\s]/g, "").split(",")
        .map((el) => {
          if (el.indexOf("reserve1") > -1) {
            data.reserve0 = el.split("=")[1]
          } else if (el.indexOf("reserve0") > -1) {
            data.reserve1 = el.split("=")[1]
          }
        })
    }
    return {
      isSuccess: res.isSuccess,
      result: res.isSuccess ? data : res.result.message
    }
  }
  private static handleAxiosRes(axiosRes: AxiosResponse): NetworkResponse {
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
      res.result.message = Error.NETWORK_ERROR
    }
    return res
  }
}
