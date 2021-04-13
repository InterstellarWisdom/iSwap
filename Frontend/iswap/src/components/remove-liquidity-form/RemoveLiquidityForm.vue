<template>
  <div class="remove-liquidity-form">
    <div class="title">Remove liquidity</div>
    <a-space direction="vertical" :size="20" style="width: 100%;">
      <div class="remove-ratio">
        {{`${value}%`}}
      </div>
      <a-slider v-model:value="value" :tip-formatter="null"></a-slider>
      <div class="slider-buttons">
        <a-button @click="setSlider(25)">25%</a-button>
        <a-button @click="setSlider(50)">50%</a-button>
        <a-button @click="setSlider(75)">75%</a-button>
        <a-button @click="setSlider(100)">Max</a-button>
      </div>
      <div class="pooled-info">
        <div class="pooled-token">
          <div class="pooled-token-amount">0.0840579</div>
          <div class="pooled-token-name"><img><span>UNI</span></div>
        </div>
        <div class="pooled-token">
          <div class="pooled-token-amount">0.0104873</div>
          <div class="pooled-token-name"><img><span>ETH</span></div>
        </div>
      </div>
      <div class="remove-liquidity-button">
        <a-button size="large" block>确定移除</a-button>
      </div>
    </a-space>
  </div>
</template>
<script lang="ts">
  import { RemoveLiquidityFormTs } from "./RemoveLiquidityFormTs";
  export default RemoveLiquidityFormTs
</script>
<style lang="less" scoped>
  @import url("./RemoveLiquidityForm.less");
</style>