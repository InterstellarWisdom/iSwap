<template>
  <div class="pool-container">
    <div class="pool__head">
      <div class="pool__head--text">
        Your liquidity
      </div>
      <div class="pool__head--buttons">
        <router-link to="create">
          <a-button class="first-button">Create pair</a-button>
        </router-link>
        <router-link to="add-liquidity">
          <a-button>Add liquidity</a-button>
        </router-link>
      </div>
    </div>
    <LiquidityList class="liquidity-list"></LiquidityList>
  </div>
</template>
<script lang="ts">
  import { PoolTs } from "./PoolTs"
  export default PoolTs
</script>
<style lang="less" scoped>
  @import url("./Pool.less");
</style>