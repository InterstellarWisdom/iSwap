<template>
  <div class="slide-point-select">
    <button class="slide__option" :class="{active:currentSlide===1}" @click="handleSlideToggle(1)">1%</button>
    <button class="slide__option" :class="{active:currentSlide===2}" @click="handleSlideToggle(2)">2%</button>
    <div class="slide__option slide__option--custom" :class="{active:currentSlide===3}" @click="handleSlideToggle(3)">
      <NumberInput class="slide__option--input"></NumberInput>
      <span>%</span>
    </div>
  </div>
</template>
<script lang="ts">
  import { SlidePointSelectTs } from "./SlidePointSelectTs"
  export default SlidePointSelectTs
</script>
<style lang="less" scoped>
  @import url("./SlidePointSelect.less");
</style>