<template>
  <a-modal :visible="visible" title="select a token" @ok="handleOk" @cancel="handleCancel" :footer="null">
    <AssetSelect></AssetSelect>
  </a-modal>
</template>
<script>
  import { AssetSelectModalTs } from "./AssetSelectModalTs"
  export default AssetSelectModalTs
</script>