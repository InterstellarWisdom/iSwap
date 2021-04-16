<template>
  <div class="liquidity-detail">
    <a-space direction="vertical" :size="8" style="width: 100%;">
      <div class="liquidity-detail-item">
        <div class="item-head">Your total pool token:</div>
        <div class="item-detail">{{liquidityInfo.liquidity}}</div>
      </div>
      <div class="liquidity-detail-item">
        <div class="item-head">Pooled {{token0}}:</div>
        <div class="item-detail">{{pooled0}}</div>
      </div>
      <div class="liquidity-detail-item">
        <div class="item-head">Pooled {{token1}}:</div>
        <div class="item-detail">{{pooled1}}</div>
      </div>
      <div class="liquidity-detail-item">
        <div class="item-head">Your pool share:</div>
        <div class="item-detail">{{liquidityInfo.liquidity/totalLiquidity}}</div>
      </div>
    </a-space>
    <div class="liquidity-detail-buttons">
      <div class="button">
        <a-button block>add</a-button>
      </div>
      <div class="button">
        <a-button type="primary" block @click="goRemoveLiquidity">remove</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { LiquidityDetailTs } from "./LiquidityDetailTs";
  export default LiquidityDetailTs
</script>
<style lang="less" scoped>
  @import url("./LiquidityDetail.less");
</style>