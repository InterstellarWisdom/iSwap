<template>
  <div class="add-liquidity-form">
    <div class="title">Add liquidity</div>
    <div>
      <TokenSelectAndInput @on-token-select-and-input="handleTokenSelectAndInput" :id="'1'"></TokenSelectAndInput>
    </div>
    <div class="add-liquidity-symbol">

      <svg t="1617689788658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="5451" width="26" height="26">
        <path
          d="M1023.3604 475.772642H548.227358V0.6396h-73.094316v475.133042H0v73.094316h475.133042v475.133042h73.094316V548.866958H1023.3604z"
          p-id="5452" fill="#8a8a8a"></path>
      </svg>

    </div>
    <div>
      <TokenSelectAndInput @on-token-select-and-input="handleTokenSelectAndInput" :id="'2'"></TokenSelectAndInput>
    </div>
    <div class="add-liquidity-button">
      <a-spin :spinning="isAdding">
        <button @click="isInputtingPass=true">Add liquidity</button>
      </a-spin>
    </div>
    <PasswordForm :visible="isInputtingPass" @on-password-input="handlePasswordInput"></PasswordForm>
  </div>

</template>
<script lang="ts">
  import { AddLiquidityFormTs } from "./AddLiquidityFormTs"
  export default AddLiquidityFormTs
</script>
<style lang="less" scoped>
  @import url("./AddLiquidityForm.less");
</style>