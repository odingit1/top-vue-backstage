<template>
  <div class="content">
    <AResult class="result" status="404" :subtitle="'not found'"> </AResult>
    <div class="operation-row">
      <AButton key="back" type="primary" @click="back"> back </AButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const back = () => {
  // warning： Go to the node that has the role
  router.push({ name: 'MeInfo' })
}
</script>

<style scoped lang="less">
.content {
  // padding-top: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -95px;
  margin-top: -121px;
  text-align: center;
}
</style>
