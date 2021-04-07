<template>
  <ul class="asset-list">
    <li class="asset-item" v-for="token in tokenList" :key="token.address" @click="handleSelect(token)">
      <img class="asset-logo" :src="require(`@/assets/icons/nuls.png`)">
      <div class="asset-info">
        <div class="asset-info__symbol">{{token.symbol}}</div>
        <div class="asset-info__name">{{token.name}}</div>
      </div>
    </li>
  </ul>
</template>
<script lang="ts">
  import { AssetListTs } from "./AssetListTs"
  export default AssetListTs
</script>
<style lang="less" scoped>
  @import url("./AssetList.less");
</style>