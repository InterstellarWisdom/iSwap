<template>
  <a-modal :visible="visible" title="密码" @ok="closeModal" @cancel="closeModal" :footer="null">
    <div>密码输入</div>
    <a-input type="text" v-model:value="password" placeholder="请输入账号密码"></a-input>
    <a-button block @click="handlePassInput"> 确定</a-button>
  </a-modal>
</template>
<script lang="ts">
  import { PasswordFormTs } from "./PasswordFormTs"
  export default PasswordFormTs
</script>
<style lang="less" scoped>
  @import url("./PasswordForm.less");
</style>