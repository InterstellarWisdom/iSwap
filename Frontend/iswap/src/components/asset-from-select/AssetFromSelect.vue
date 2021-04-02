<template>
  <div class="swap__from">
    <a-modal :visible="visible" title="select a token" @ok="handleOk" @cancel="handleCancel" :footer="null">
      <AssetList @on-token-select="handleTokenSelect"></AssetList>
    </a-modal>
    <div class="token-list__entry--from" @click="assetSelectToggle"><img
        :src="require(`@/assets/icons/nuls.png`)" /><span class="asset__name">{{fromToken.symbol}}</span>
      <svg t="1616578825035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="5942" width="20" height="20">
        <path
          d="M300.586667 895.701333c9.6 0 19.328-3.2 27.392-9.6l423.808-340.906666a43.733333 43.733333 0 0 0 0-68.096L329.813333 137.984A43.690667 43.690667 0 0 0 275.114667 206.08l379.605333 305.109333-381.525333 306.773334a43.690667 43.690667 0 0 0 27.392 77.738666z"
          fill="#000000" opacity="0.2" p-id="5943"></path>
      </svg>
    </div>
    <div class="swap__amount"><input type="text" placeholder="0.00" :value="amountIn" @input="handleInput" /><span>≈
        10000000.00 RMB</span>
    </div>
  </div>
</template>
<script lang="ts">
  import { AssetFromSelectTs } from "./AssetFromSelectTs"
  export default AssetFromSelectTs
</script>
<style lang="less" scoped>
  @import url("./AssetFromSelect.less");
</style>