<template>
  <a-modal :visible="visible" title="密码" @ok="closeModal" @cancel="closeModal" :footer="null">
    <a-space direction="vertical" style="width:100%" :size="15">
      <div class="title">密码输入</div>
      <div>
        <a-input type="text" v-model:value="password" placeholder="请输入账号密码" size="large"></a-input>
      </div>
    </a-space>
    <div class="button-container">
      <a-button type="primary" block @click="handlePassInput" size="large">确定</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts">
  import { PasswordFormTs } from "./PasswordFormTs"
  export default PasswordFormTs
</script>
<style lang="less" scoped>
  @import url("./PasswordForm.less");
</style>