<template>
  <div class="token-select-and-input__container">
    <a-modal :visible="visible" title="select a token" @ok="handleOk" @cancel="handleCancel" :footer="null"  centered>
      <AssetList @on-token-select="handleTokenSelect" :filter="selectedToken"></AssetList>
    </a-modal>
    <div class="token-list__entry" @click="assetSelectToggle">
      <div v-if="selectedToken" class="token-list__entry--select">
        <img :src="require(`@/assets/icons/nuls.png`)" /><span class="asset__name">{{selectedToken.symbol}}</span>
        <svg t="1616578825035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="5942" width="20" height="20">
          <path
            d="M300.586667 895.701333c9.6 0 19.328-3.2 27.392-9.6l423.808-340.906666a43.733333 43.733333 0 0 0 0-68.096L329.813333 137.984A43.690667 43.690667 0 0 0 275.114667 206.08l379.605333 305.109333-381.525333 306.773334a43.690667 43.690667 0 0 0 27.392 77.738666z"
            fill="#000000" opacity="0.2" p-id="5943"></path>
        </svg>
      </div>
      <div v-else>
        请选择
      </div>
    </div>
    <div class="token__input--amount"><input type="text" placeholder="0.00" :value="amountInput"
        @input="handleInput" />
    </div>
  </div>
</template>
<script lang="ts">
  import { TokenSelectAndInputTs } from "./TokenSelectAndInputTs"
  export default TokenSelectAndInputTs
</script>
<style lang="less" scoped>
  @import url("./TokenSelectAndInput.less");
</style>