<template>
  <div @click="showModal">
    <slot>
      <a-button>Manage account</a-button>
    </slot>
  </div>
  <a-modal :visible="visible" title="Account" @ok="handleOk" @cancel="handleCancel" :footer="null">
    <div class="account-manage-modal">
      <div class="title">Connected</div>
      <div class="address">
        <AddressDisplay :address="address"></AddressDisplay>
      </div>
      <div class="buttons">
        <div class="button-container" id="copy" @click="copy">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="button-text">Copy address</span>
        </div>
        <div class="button-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span class="button-text">View on Nuls</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
  import { AccountManageModalTs } from "./AccountManageModalTs";
  export default AccountManageModalTs
</script>
<style lang="less" scoped>
  @import url("./AccountManageModal.less");
</style>