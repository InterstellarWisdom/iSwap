<template>
  <a-modal :visible="visible" title="连接一个钱包" @ok="closeModal" @cancel="closeModal" :footer="null">
    <a-space direction="vertical" style="width: 100%;" :size="30">
      <div class="connect-type-nav text-center">
        <div @click="connectTypeToggle('import')" :class="{active:connectType==='import'}">私钥导入</div>
        <div @click="connectTypeToggle('create')" :class="{active:connectType==='create'}">新建一个钱包</div>
      </div>
      <div>
        <div v-if="connectType==='import'">
          <a-space direction="vertical" style="width: 100%;" :size="20">
            <div>
              <a-space direction="vertical" style="width: 100%;" :size="10">
                <div>私钥</div>
                <a-input v-model:value="plainPriKey" size="large"></a-input>
              </a-space>
            </div>
            <div>
              <a-space direction="vertical" style="width: 100%;" :size="10">
                <div>请输入一个密码管理你的私钥</div>
                <a-input type="password" v-model:value="password" placeholder="至少八位数" size="large"></a-input>
              </a-space>
            </div>
          </a-space>
        </div>
        <div v-if="connectType==='create'">
          <a-space direction="vertical" style="width: 100%;" :size="10">
            <div>
              请输入一个密码管理你的私钥
            </div>
            <div>
              <a-input type="password" v-model:value="password" placeholder="至少八位数" size="large" />
            </div>
          </a-space>
        </div>
      </div>
      <div>
        <a-spin :spinning="isConnecting">
          <a-button @click="handleAccountConnect" block size="large">完成</a-button>
        </a-spin>
      </div>
    </a-space>
  </a-modal>

</template>
<script lang="ts">
  import { AccountConnectFormTs } from "./AccountConnectFormTs"
  export default AccountConnectFormTs
</script>
<style lang="less" scoped>
  @import url("./AccountConnectForm.less");
</style>