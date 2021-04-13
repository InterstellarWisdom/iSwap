<template>
  <div v-if="address" class="account-container">
    <div class="account-info">
      <TokenBalance class="token-balance"></TokenBalance>
      <span class="token-name">Nuls</span>
      <div class="address__wrapper">
        <AddressDisplay :address="address"></AddressDisplay>
      </div>
    </div>
    <div class="more">
      <svg t="1618212072318" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4874" width="20" height="20">
        <path
          d="M231.08266667 509.49688889c-0.11377778 51.76888889-41.87022222 93.52533333-93.75288889 93.41155556-51.65511111-0.11377778-93.63911111-42.09777778-93.52533333-93.86666667 0-51.54133333 42.21155555-93.52533333 93.98044444-93.41155556 51.65511111 0.11377778 93.29777778 41.984 93.29777778 93.86666667z m656.49777778-93.75288889c51.76888889 0 93.86666667 41.87022222 93.86666666 93.52533333 0.11377778 51.65511111-41.87022222 93.75288889-93.63911111 93.75288889-51.88266667 0-93.75288889-41.64266667-93.75288889-93.52533333s41.64266667-93.75288889 93.52533334-93.75288889zM512.45511111 603.02222222c-51.65511111 0-93.98044445-42.43911111-93.75288889-93.75288889 0.34133333-51.76888889 42.21155555-93.52533333 93.98044445-93.52533333 51.65511111 0 93.86666667 42.21155555 93.63911111 93.75288889-0.11377778 51.65511111-42.09777778 93.52533333-93.86666667 93.52533333z"
          p-id="4875"></path>
      </svg>
    </div>
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