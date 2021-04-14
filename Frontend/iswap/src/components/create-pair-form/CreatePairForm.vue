<template>
  <div class="create-pair-form">
    <div class="title">Create pair</div>
    <div class="a-token">
      <TokenSelectAndInput @on-token-select-and-input="handleTokenSelectAndInput" :initialToken="originalToken"
        :id="'1'"></TokenSelectAndInput>
    </div>
    <div class="create-symbol">
      <svg t="1617689788658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="5451" width="26" height="26">
        <path
          d="M1023.3604 475.772642H548.227358V0.6396h-73.094316v475.133042H0v73.094316h475.133042v475.133042h73.094316V548.866958H1023.3604z"
          p-id="5452" fill="#8a8a8a"></path>
      </svg>
    </div>
    <div class="b-token">
      <TokenSelectAndInput @on-token-select-and-input="handleTokenSelectAndInput" :id="'2'"></TokenSelectAndInput>
    </div>
    <div class="create__button">
      <a-spin :spinning="isCreating">
        <PasswordFormModal @on-password-input="handlePasswordInput">
          <a-button>Create Pair</a-button>
        </PasswordFormModal>
      </a-spin>
    </div>

  </div>

</template>
<script lang="ts">
  import { CreatePairFormTs } from "./CreatePairFormTs"
  export default CreatePairFormTs
</script>
<style lang="less" scoped>
  @import url("./CreatePairForm.less");
</style>