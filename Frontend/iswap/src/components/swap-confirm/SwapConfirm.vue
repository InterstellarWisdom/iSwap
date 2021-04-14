<template>
  <div>
    <a-modal :visible="visible" title="兑换 swap" @ok="closeModal" @cancel="closeModal" :footer="null">
      <div class="info text-center">
        <div class="from">
          <div><span class="token-name">{{swapParams.from.name}}</span></div>
          <div>
            <span class="token-amount__in">{{swapParams.amountIn}}</span>
          </div>
        </div>
        <div class="arrow">
          <svg t="1617899452154" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="2008" width="26" height="26">
            <path
              d="M515.2 92.8l0 755.2-236.8-230.4c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l291.2 284.8c0 0 3.2 0 3.2 3.2 3.2 3.2 3.2 3.2 6.4 3.2 3.2 0 6.4 3.2 9.6 3.2 0 0 0 0 3.2 0 0 0 0 0 0 0 3.2 0 9.6 0 12.8-3.2 3.2-3.2 6.4-3.2 9.6-6.4l288-288c6.4-6.4 9.6-16 9.6-22.4s-3.2-16-9.6-22.4c-12.8-12.8-32-12.8-44.8 0l-233.6 233.6L579.2 92.8c0-19.2-12.8-32-32-32S515.2 76.8 515.2 92.8z"
              p-id="2009"></path>
          </svg>
        </div>
        <div class="to">
          <div class="tip">estimated</div>
          <div><span class="token-name">{{swapParams.to.name}}</span></div>
          <div>
            <span class="token-amount__out">{{swapParams.amountOutMin}}</span><span></span>
          </div>
        </div>
        <div>
          <PairRatio :tokenA="swapParams.from" :amountA="swapParams.amountIn" :tokenB="swapParams.to"
            :amountB="swapParams.amountOutMin"></PairRatio>
        </div>
      </div>
      <a-spin :spinning="isSwapping">
        <div class="swap__buttons">
          <PasswordFormModal @on-password-input="handlePassInput">
            <a-button type="primary" block size="large">Confirm Swap</a-button>
          </PasswordFormModal>
        </div>
      </a-spin>
    </a-modal>
  </div>

</template>
<script lang="ts">
  import { SwapConfirmTs } from "./SwapConfirmTs"
  export default SwapConfirmTs
</script>
<style lang="less" scoped>
  @import url("./SwapConfirm.less");
</style>