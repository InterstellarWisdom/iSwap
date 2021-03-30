<template>
  <ul>
    <li class="asset-item">
      <img class="asset-logo" :src="require(`@/assets/icons/nuls.png`)">
      <div class="asset-info">
        <div class="asset-info__symbol">NULS</div>
        <div class="asset-info__name">NULS</div>
      </div>
    </li>
    <li class="asset-item">
      <img class="asset-logo" :src="require(`@/assets/icons/nuls.png`)">
      <div class="asset-info">
        <div class="asset-info__symbol">VOX</div>
        <div class="asset-info__name">VoxFinance</div>
      </div>
    </li>
  </ul>
</template>
<script lang="ts">
  import { AssetSelectTs } from "./AssetSelectTs"
  export default AssetSelectTs
</script>
<style lang="less" scoped>
  @import url("./AssetSelect.less");
</style>