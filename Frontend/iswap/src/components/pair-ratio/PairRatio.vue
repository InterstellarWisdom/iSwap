<template>
  <span>1 {{leftToken?.name}}</span> = <span>{{amountRight}} {{rightToken?.name}}</span>
</template>
<script lang="ts">
  import { PairRatioTs } from "./PairRatioTs";
  export default PairRatioTs
</script>
<style lang="less" scoped>
  @import url("./PairRatio.less");
</style>