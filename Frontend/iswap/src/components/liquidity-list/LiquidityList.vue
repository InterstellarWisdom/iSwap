<template>
  <div>
    <a-collapse :expand-icon-position="'right'">
      <a-collapse-panel key="1" :style="panelStyle">
        <template #header>
          <div class="header">
            <img :src="url" />
            <img :src="url" class="second" />
            Nuls/N1
          </div>
        </template>
        <LiquidityDetail></LiquidityDetail>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
  import { LiquidityListTs } from "./LiquidityListTs"
  export default LiquidityListTs
</script>
<style lang="less" scoped>
  @import url("./LiquidityList.less");
</style>