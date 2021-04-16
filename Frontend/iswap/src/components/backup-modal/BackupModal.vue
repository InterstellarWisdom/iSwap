<template>
  <div>
    <div @click="showModal">
      <slot>钱包备份</slot>
    </div>
    <a-modal :visible="visible" title="钱包备份" @ok="handleCancel" @cancel="handleCancel" :footer="null">
      <a-input type="password" placeholder="请输入密码"></a-input>
    </a-modal>
  </div>
</template>
<script lang="ts">
  import { BackupModalTs } from "./BackupModalTs"
  export default BackupModalTs
</script>
<style lang="less" scoped>
  @import url("./BackupModal.less");
</style>