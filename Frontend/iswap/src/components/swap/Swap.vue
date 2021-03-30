<template>
  <div class="swap-form text-center">
    <AssetSelectModal></AssetSelectModal>
    <div class="text-left head">Swap from</div>
    <div class="swap__from">
      <div class="token-list__entry--from" @click="assetSelectToggle"><img :src="require(`@/assets/icons/nuls.png`)" /><span
          class="asset__name">NULS</span>
        <svg t="1616578825035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="5942" width="20" height="20">
          <path
            d="M300.586667 895.701333c9.6 0 19.328-3.2 27.392-9.6l423.808-340.906666a43.733333 43.733333 0 0 0 0-68.096L329.813333 137.984A43.690667 43.690667 0 0 0 275.114667 206.08l379.605333 305.109333-381.525333 306.773334a43.690667 43.690667 0 0 0 27.392 77.738666z"
            fill="#000000" opacity="0.2" p-id="5943"></path>
        </svg>
      </div>
      <div class="swap__amount"><input type="text" value="100" /><span>≈ 10000000.00 RMB</span></div>
    </div>
    <div class="swap-symbol">
      <span>
        <svg t="1616577766343" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="4594" width="26" height="26">
          <path
            d="M320 938.666667a21.333333 21.333333 0 0 1-21.333333-21.333334V158.166667L164.42 292.42a21.333333 21.333333 0 0 1-30.173333-30.173333l170.666666-170.666667A21.333333 21.333333 0 0 1 341.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-21.333333 21.333334z m399.086667-6.246667l170.666666-170.666667a21.333333 21.333333 0 0 0-30.173333-30.173333L725.333333 865.833333V106.666667a21.333333 21.333333 0 0 0-42.666666 0v810.666666a21.333333 21.333333 0 0 0 36.42 15.086667z"
            fill="#5C5C66" p-id="4595"></path>
        </svg>
      </span>
    </div>
    <div class="swap__to">
      <div class="text-left head">
        Swap to
      </div>
      <div class="token-list__entry--to" @click="assetSelectToggle">
        <span class="asset__name">SKL</span>
        <svg t="1616578825035" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="5942" width="20" height="20">
          <path
            d="M300.586667 895.701333c9.6 0 19.328-3.2 27.392-9.6l423.808-340.906666a43.733333 43.733333 0 0 0 0-68.096L329.813333 137.984A43.690667 43.690667 0 0 0 275.114667 206.08l379.605333 305.109333-381.525333 306.773334a43.690667 43.690667 0 0 0 27.392 77.738666z"
            fill="#000000" opacity="0.2" p-id="5943"></path>
        </svg>
      </div>
    </div>
    <div class="swap__options">
      <div class="swap__options--title">options</div>
      <div>
        <div class="text-left">滑点</div>
        <SlidePointSelect></SlidePointSelect>
      </div>
    </div>
    <div class="swap__buttons">
      <button>Swap</button>
    </div>
  </div>
</template>
<script lang="ts">
  import { SwapTs } from "./SwapTs"
  export default SwapTs
</script>
<style lang="less" scoped>
  @import url("./Swap.less");
</style>