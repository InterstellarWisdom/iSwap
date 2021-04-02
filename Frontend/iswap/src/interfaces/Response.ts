export interface Response {
  jsonrpc: string,
  id: string,
  result: {
    [type: string]: string
  }
}