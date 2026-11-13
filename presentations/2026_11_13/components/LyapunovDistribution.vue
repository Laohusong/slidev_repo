<template>
  <div class="cdf-chart">
    <svg viewBox="0 0 700 390" role="img" aria-label="Illustrative ordered Lyapunov exponents; bars below the moving threshold change color">
      <g class="cdf-grid">
        <line v-for="tick in ticks" :key="tick" x1="57" :y1="y(tick)" x2="666" :y2="y(tick)" />
      </g>
      <line x1="57" y1="195" x2="666" y2="195" class="zero-line" />
      <g class="cdf-bars">
        <rect v-for="(value, index) in exponents" :key="index"
          :x="75 + index * 48" :y="Math.min(y(value), y(0))"
          width="28" :height="Math.max(2, Math.abs(y(value) - y(0)))"
          :class="value < threshold ? 'selected' : 'unselected'" />
      </g>
      <line x1="57" :y1="y(threshold)" x2="666" :y2="y(threshold)" class="threshold-line" />
      <text x="636" :y="Math.max(28, y(threshold) - 9)" class="threshold-label">s = {{ threshold.toFixed(2) }}</text>
      <g class="cdf-axes">
        <line x1="57" y1="35" x2="57" y2="335" />
        <line x1="57" y1="335" x2="666" y2="335" />
      </g>
      <text x="24" y="181" transform="rotate(-90 24 181)" text-anchor="middle" class="axis-label">Lyapunov exponent</text>
      <text x="360" y="375" text-anchor="middle" class="axis-label">index i (ordered by exponent)</text>
      <text x="76" y="357" text-anchor="middle" class="tick-label">1</text>
      <text x="630" y="357" text-anchor="middle" class="tick-label">N</text>
      <text x="48" y="200" text-anchor="end" class="tick-label">0</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { exponents, threshold } from './cdfState'

const ticks = [-1, -0.5, 0, 0.5, 1]
const y = (value: number) => 195 - value * 140
let frame = 0
let start = 0
function animate(now: number) {
  if (!start) start = now
  const phase = ((now - start) % 6000) / 6000
  threshold.value = -0.9 + 1.8 * (phase < 0.5 ? phase * 2 : (1 - phase) * 2)
  frame = requestAnimationFrame(animate)
}
onMounted(() => { frame = requestAnimationFrame(animate) })
onUnmounted(() => { cancelAnimationFrame(frame) })
</script>

<style scoped>
.cdf-chart { width: 100%; }
svg { display: block; width: 100%; height: 390px; }
.cdf-grid line { stroke: #dbe3ed; stroke-width: 1; }
.zero-line { stroke: #8292a7; stroke-width: 1.3; }
.cdf-axes line { stroke: #52637d; stroke-width: 1.5; }
.cdf-bars rect { transition: fill .22s ease; }
.cdf-bars .selected { fill: #2376ce; }
.cdf-bars .unselected { fill: #a8b5c6; }
.threshold-line { stroke: #b34b55; stroke-width: 2.3; stroke-dasharray: 8 6; }
.threshold-label { fill: #a23844; font: 18px Georgia, serif; text-anchor: end; }
.axis-label { fill: #34445e; font: 17px Georgia, serif; }
.tick-label { fill: #60718a; font: 15px Georgia, serif; }
</style>
