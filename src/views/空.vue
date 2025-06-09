<template>

  <var-result :type="type" title="空页面" description="看到我的原因是app没有在地址栏传入'type'字段">
    <template #footer>
      <var-button v-show="type==='warning'" type="warning" @click="点击()">知道了,看看功能</var-button>
    </template>
  </var-result>

</template>

<script setup>
  import {ref,inject} from 'vue';
  import {消息} from "@/常用方法.js";
  // const 传递参数=inject("传递参数");
  // const type=ref("warning");

  // function 点击(){
  //   type.value="success";
  //   消息('正在跳转');
  //   setTimeout(()=>{
  //     传递参数.value.type="测试";
  //   },1000)
  // }
</script>

<style scoped>

</style>