<template>
  <a-modal :visible="visible" title="select a token" @ok="closeModal" @cancel="closeModal" :footer="null">
    <div class="info">
      <div class="from">
        <div>swap from:{{swapParams.from.name}}</div>
        <div>待兑换数量:{{swapParams.amountIn}}</div>
      </div>
      <div class="to">
        <div>swap to:{{swapParams.to.name}}</div>
        <div>预估能够得到: {{swapParams.amountOutMin}}</div>
      </div>
    </div>
    <a-spin :spinning="isSwapping">
      <div class="swap__buttons">
        <button @click="confirmSwap">Confirm Swap</button>
      </div>
    </a-spin>
  </a-modal>
</template>
<script lang="ts">
  import { SwapConfirmTs } from "./SwapConfirmTs"
  export default SwapConfirmTs
</script>
<style lang="less" scoped>
  @import url("./SwapConfirm.less");
</style>