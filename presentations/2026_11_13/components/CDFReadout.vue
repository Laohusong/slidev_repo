<template>
  <div class="cdf-readout">
    <div>Current threshold: <strong>s = {{ threshold.toFixed(2) }}</strong></div>
    <div>Exponents below it: <strong>{{ belowCount }} of {{ exponents.length }}</strong></div>
    <div class="cdf-value">F(s) = {{ belowCount }} / {{ exponents.length }} = {{ (belowCount / exponents.length).toFixed(2) }}</div>
  </div>
</template>

<script setup lang="ts">
import { exponents, threshold, belowCount } from './cdfState'
</script>

<style scoped>
.cdf-readout { border-top: 1px solid #bbc8d9; padding-top: .85rem; margin-top: .9rem; line-height: 1.7; }
.cdf-readout strong { color: #245da5; }
.cdf-value { color: #245da5; font: 1.35rem Georgia, serif; margin-top: .3rem; }
</style>
