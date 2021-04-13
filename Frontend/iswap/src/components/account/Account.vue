<template>
  <div v-if="address" class="account-container">
    <div class="account-info">
      <TokenBalance class="token-balance"></TokenBalance>
      <span class="token-name">Nuls</span>
      <div class="address__wrapper">
        <AccountManageModal>
          <AddressDisplay :address="address"></AddressDisplay>
        </AccountManageModal>
      </div>
    </div>
    <More></More>
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