<template>
  <div class="shifted-spectrum">
    <svg viewBox="0 0 700 390" role="img" aria-label="An illustrative Lyapunov bar chart translates as the shift changes; bars with negative shifted exponents turn blue">
      <g class="spectrum-grid">
        <line v-for="tick in ticks" :key="tick" x1="58" :y1="y(tick)" x2="666" :y2="y(tick)" />
      </g>
      <g class="spectrum-bars" :transform="`translate(0 ${shift * scale})`">
        <line x1="58" :y1="y(0)" x2="666" :y2="y(0)" class="moving-baseline" />
        <rect v-for="(value, index) in exponents" :key="index"
          :x="76 + index * 48" :y="Math.min(y(value), y(0))"
          width="28" :height="Math.max(2, Math.abs(y(value) - y(0)))"
          :class="value - shift < 0 ? 'negative-bar' : 'positive-bar'" />
        <circle v-for="(value, index) in exponents" :key="`end-${index}`"
          :cx="90 + index * 48" :cy="y(value)" r="3.5"
          :class="value - shift < 0 ? 'negative-bar' : 'positive-bar'" />
      </g>
      <line x1="58" :y1="y(0)" x2="666" :y2="y(0)" class="fixed-zero" />
      <g class="spectrum-axes">
        <line x1="58" y1="20" x2="58" y2="365" />
        <line x1="58" y1="365" x2="666" y2="365" />
      </g>
      <text x="22" y="193" text-anchor="middle" transform="rotate(-90 22 193)" class="axis-label">shifted exponent</text>
      <text x="360" y="381" text-anchor="middle" class="axis-label">index i</text>
      <text x="79" y="386" text-anchor="middle" class="tick-label">1</text>
      <text x="633" y="386" text-anchor="middle" class="tick-label">N</text>
    </svg>
    <div class="spectrum-caption">
      <span>Shift: {{ shift.toFixed(2) }} · endpoints below fixed zero turn blue.</span>
      <strong>{{ negativeCount }} of {{ exponents.length }} directions decay</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { exponents } from './cdfState'

const scale = 110
const ticks = [-1.5, -1, -.5, .5, 1, 1.5]
const shift = ref(-.75)
const negativeCount = computed(() => exponents.filter(value => value - shift.value < 0).length)
const y = (value: number) => 190 - value * scale
let frame = 0
let start = 0
function animate(now: number) {
  if (!start) start = now
  const phase = ((now - start) % 10000) / 10000
  shift.value = -.75 + 1.5 * (phase < .5 ? phase * 2 : (1 - phase) * 2)
  frame = requestAnimationFrame(animate)
}
onMounted(() => { frame = requestAnimationFrame(animate) })
onUnmounted(() => { cancelAnimationFrame(frame) })
</script>

<style scoped>
.shifted-spectrum { width: 100%; color: #34445e; }
svg { display: block; width: 100%; height: 370px; }
.spectrum-grid line { stroke: #d9e1eb; stroke-width: 1; }
.moving-baseline { stroke: #9eafc3; stroke-width: 1.2; stroke-dasharray: 4 4; }
.spectrum-bars rect, .spectrum-bars circle { transition: fill .22s ease; }
.positive-bar { fill: #a8b5c6; }
.negative-bar { fill: #2376ce; }
.fixed-zero { stroke: #b34b55; stroke-width: 2.4; stroke-dasharray: 8 6; }
.spectrum-axes line { stroke: #52637d; stroke-width: 1.5; }
.axis-label { fill: #34445e; font: 17px Georgia, serif; }
.tick-label { fill: #60718a; font: 15px Georgia, serif; }
.spectrum-caption { display: flex; justify-content: space-between; gap: 1rem; font-size: .8rem; padding: .1rem .2rem 0; }
.spectrum-caption strong { color: #226ab7; white-space: nowrap; }
</style>
