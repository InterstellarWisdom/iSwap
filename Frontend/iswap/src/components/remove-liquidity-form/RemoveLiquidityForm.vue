<template>
  <div class="remove-liquidity-form">
    <div class="title">Remove liquidity</div>
    <a-space direction="vertical" :size="30" style="width: 100%;">
      <div class="slider-container">
        <a-space direction="vertical" :size="30" style="width: 100%;">
          <div class="remove-ratio text-center">
            <span class="remove-ratio-title">Amount</span><span class="remove-ratio-value">{{`${sliderValue}%`}}</span>
          </div>
          <a-slider v-model:value="sliderValue" :tip-formatter="null"></a-slider>
          <div class="slider-buttons">
            <a-button @click="setSlider(25)">25%</a-button>
            <a-button @click="setSlider(50)">50%</a-button>
            <a-button @click="setSlider(75)">75%</a-button>
            <a-button @click="setSlider(100)">Max</a-button>
          </div>
        </a-space>
      </div>
      <div class="remove-symbol text-center">
        <svg t="1618303750543" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2009" width="24" height="24">
          <path
            d="M822.625 521.377c-12.513-12.513-32.735-12.513-45.248 0L544 754.753V192c0-17.665-14.336-32-32.001-32s-32 14.335-32 32v562.753L246.622 521.377c-12.513-12.513-32.735-12.513-45.248 0s-12.513 32.735 0 45.248l288 287.968c2.944 2.976 6.496 5.312 10.432 6.945A31.43 31.43 0 0 0 512 864c4.16 0 8.32-0.833 12.224-2.463 3.936-1.633 7.455-3.969 10.431-6.945l288-287.968c12.48-12.513 12.48-32.737-0.03-45.248z"
            p-id="2010"></path>
        </svg>
      </div>
      <div class="pooled-info">
        <a-space direction="vertical" :size="20" style="width: 100%;">
          <div class="pooled-token">
            <div class="pooled-token-amount">{{removedPooled0}}</div>
            <div class="pooled-token-name"><img><span>{{token0}}</span></div>
          </div>
          <div class="pooled-token">
            <div class="pooled-token-amount">{{removedPooled1}}</div>
            <div class="pooled-token-name"><img><span>{{token1}}</span></div>
          </div>
        </a-space>
      </div>
      <div class="remove-liquidity-button">
        <a-spin :spinning="isRemoving">
          <PasswordFormModal @on-password-input="handlePasswordInput">
            <a-button size="large" block>确定移除</a-button>
          </PasswordFormModal>
        </a-spin>
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