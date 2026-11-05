<script setup>
import { ref } from 'vue'
const value = ref(50)
</script>

<template>
  <div style="padding:28px;border:1px solid #cbd5e1;border-radius:16px;margin-top:24px;background:#f8fafc;color:#0f172a">
    <label style="display:block;margin-bottom:18px">参数：{{ value }}%</label>
    <input aria-label="调整参数" v-model.number="value" type="range" min="0" max="100" style="width:100%;accent-color:#2563eb" />
    <div style="height:36px;background:#e2e8f0;border-radius:8px;margin-top:24px;overflow:hidden">
      <div :style="{width: value + '%', height:'100%', background:'#2563eb', transition:'width 0.08s'}"></div>
    </div>
  </div>
</template>
