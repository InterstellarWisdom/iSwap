<template>
  <div class="swap-form text-center">
    <div class="text-left head">Swap from</div>
    <AssetFromSelect></AssetFromSelect>
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
      <AssetToSelect></AssetToSelect>
    </div>
<!--     <div class="swap__options">
      <div class="swap__options--title">options</div>
      <div>
        <div class="text-left">滑点</div>
        <SlidePointSelect></SlidePointSelect>
      </div>
    </div> -->
    <a-spin :spinning="isGettingQuote">
      <div class="swap__buttons">
        <button @click="handleSwap">Review Swap</button>
      </div>
    </a-spin>

    <div v-if="isShowSwapConfirm">
      <SwapConfirm :visible="isShowSwapConfirm" @onSwapConfirm="handleSwapConfirm"></SwapConfirm>
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