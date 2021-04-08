<template>
  <a-modal :visible="visible" title="连接一个钱包" @ok="closeModal" @cancel="closeModal" :footer="null">
    <div class="connect-type-nav">
      <a-button @click="connectTypeToggle('create')">新建一个钱包</a-button>
      <a-button @click="connectTypeToggle('import')">私钥导入</a-button>
    </div>
    <div>
      <div v-if="connectType==='import'">
        <div>
          <div>私钥</div>
          <a-input v-model:value="plainPriKey"></a-input>
        </div>
        <div>
          <div>请输入一个密码管理你的私钥</div>
          <a-input type="password" v-model:value="password" placeholder="至少八位数"></a-input>
        </div>

      </div>
      <div v-if="connectType==='create'">
        <div>
          请输入一个密码管理你的私钥
        </div>
        <a-input type="password" v-model:value="password" placeholder="至少八位数" />
      </div>
    </div>
    <div>
      <a-spin :spinning="isConnecting">
        <a-button @click="handleAccountConnect" block>完成</a-button>
      </a-spin>

    </div>
  </a-modal>

</template>
<script lang="ts">
  import { AccountConnectFormTs } from "./AccountConnectFormTs"
  export default AccountConnectFormTs
</script>