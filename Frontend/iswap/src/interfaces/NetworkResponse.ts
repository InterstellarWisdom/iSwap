export interface NetworkResponse {
  isSuccess: boolean
  result: {
    message: string,
    code: string,
    data: any,
    id: string,
    jsonrpc: string
  }
}