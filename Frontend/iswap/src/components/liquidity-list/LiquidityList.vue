<template>
  <div>
    <a-collapse :expand-icon-position="'right'">
      <a-collapse-panel :style="panelStyle" v-for="(liquidityInfo,index) in liquidityList" :key="index">
        <template #header>
          <div class="header">
            <img :src="url" />
            <img :src="url" class="second" />
            <span class="pair">{{liquidityInfo.name}}</span>
          </div>
        </template>
        <LiquidityDetail :liquidityInfo="liquidityInfo"></LiquidityDetail>
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