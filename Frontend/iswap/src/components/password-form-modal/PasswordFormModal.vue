<template>
  <div>
    <span @click="showModal">
      <slot>
        <a-button type="primary">密码输入</a-button>
      </slot>
    </span>
    <a-modal :visible="visible" title="密码" @ok="handleCancel" @cancel="handleCancel" :footer="null">
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
  </div>

</template>
<script lang="ts">
  import { PasswordFormModalTs } from "./PasswordFormModalTs"
  export default PasswordFormModalTs
</script>
<style lang="less" scoped>
  @import url("./PasswordFormModal.less");
</style>