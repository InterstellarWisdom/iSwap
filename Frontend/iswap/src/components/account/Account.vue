<template>
  <div v-if="address">
    <TokenBalance></TokenBalance> Nuls {{address}}
  </div>
  <div v-else>
    <a-button @click="connect">连接一个钱包</a-button>
  </div>
  <AccountConnectForm :visible="isConnecting" @on-account-connect="handleAccountConnect"></AccountConnectForm>
</template>
<script lang="ts">
  import { AccountTs } from "./AccountTs";
  export default AccountTs
</script>
<style lang="less" scoped>
  @import url("./Account.less");
</style>