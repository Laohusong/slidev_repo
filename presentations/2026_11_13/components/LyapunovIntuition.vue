<template>
  <div class="lyapunov-plot">
    <svg viewBox="0 0 650 350" role="img" aria-label="One-dimensional trajectories: the blue original trajectory and red perturbed trajectory separate exponentially">
      <g class="grid">
        <line v-for="tick in yTicks" :key="`grid-${tick}`" x1="58" :y1="y(tick)" x2="620" :y2="y(tick)" />
      </g>
      <g class="axis">
        <line x1="58" y1="20" x2="58" y2="297" />
        <line x1="58" y1="297" x2="620" y2="297" />
      </g>
      <g class="tick-labels">
        <text v-for="tick in yTicks" :key="`y-${tick}`" x="48" :y="y(tick) + 4" text-anchor="end">{{ tick.toFixed(1) }}</text>
        <text v-for="n in 6" :key="`x-${n}`" :x="x(n - 1)" y="317" text-anchor="middle">{{ n - 1 }}</text>
      </g>
      <text x="339" y="341" text-anchor="middle" class="axis-title">time step n</text>
      <text x="17" y="158" text-anchor="middle" transform="rotate(-90 17 158)" class="axis-title">x(n)</text>

      <polyline :points="originalPoints" class="original-path" />
      <polyline :points="perturbedPoints" class="perturbed-path" />
      <g v-for="n in 6" :key="`sample-${n}`">
        <circle :cx="x(n - 1)" :cy="y(original(n - 1))" r="3" class="sample-original" />
        <circle :cx="x(n - 1)" :cy="y(perturbed(n - 1))" r="3" class="sample-perturbed" />
      </g>

      <line :x1="x(step)" :x2="x(step)" :y1="y(original(step))" :y2="y(perturbed(step))" class="separation" />
      <circle :cx="x(step)" :cy="y(original(step))" r="7" class="moving-original" />
      <circle :cx="x(step)" :cy="y(perturbed(step))" r="7" class="moving-perturbed" />
      <text v-if="step >= 2" :x="Math.min(x(step) + 11, 568)" :y="(y(original(step)) + y(perturbed(step))) / 2 + 5" class="gap-label">v({{ step }})</text>
    </svg>
    <div class="plot-legend">
      <span><i class="blue-key" /> original x(n)</span>
      <span><i class="red-key" /> perturbed x̃(n)</span>
      <span class="current-step">n = {{ step }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const step = ref(0)
const x0 = 0.05
const v0 = 0.01
const yTicks = [0, 0.5, 1, 1.5, 2]
const x = (n: number) => 58 + n * 112.4
const y = (value: number) => 297 - value * 132
const original = (n: number) => x0 * 2 ** n
const perturbed = (n: number) => (x0 + v0) * 2 ** n
const originalPoints = computed(() => Array.from({ length: 6 }, (_, n) => `${x(n)},${y(original(n))}`).join(' '))
const perturbedPoints = computed(() => Array.from({ length: 6 }, (_, n) => `${x(n)},${y(perturbed(n))}`).join(' '))

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  timer = setInterval(() => { step.value = (step.value + 1) % 6 }, 1150)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.lyapunov-plot { width: 100%; color: #34445e; font-family: Georgia, 'Times New Roman', serif; }
svg { width: 100%; height: 240px; display: block; overflow: visible; }
.grid line { stroke: #c9d4e2; stroke-width: 1; }
.axis line { stroke: #7184a0; stroke-width: 1.5; }
.tick-labels { fill: #51617b; font: 14px Georgia, serif; }
.axis-title { fill: #34445e; font: 17px Georgia, serif; }
.original-path, .perturbed-path { fill: none; stroke-width: 3; stroke-linejoin: round; }
.original-path { stroke: #247ad7; }
.perturbed-path { stroke: #d45555; stroke-dasharray: 8 6; }
.sample-original { fill: #247ad7; }
.sample-perturbed { fill: #d45555; }
.moving-original, .moving-perturbed, .separation { transition: cx .72s ease-in-out, cy .72s ease-in-out, x1 .72s ease-in-out, x2 .72s ease-in-out, y1 .72s ease-in-out, y2 .72s ease-in-out; }
.moving-original { fill: #247ad7; stroke: #e8f3ff; stroke-width: 1.5; }
.moving-perturbed { fill: #d45555; stroke: #fff0f0; stroke-width: 1.5; }
.separation { stroke: #ab7617; stroke-width: 3; }
.gap-label { fill: #8b6014; font: italic 17px Georgia, serif; }
.plot-legend { display: flex; gap: 22px; align-items: center; margin-left: 8%; font-size: 15px; }
.plot-legend span { white-space: nowrap; }
.plot-legend i { display: inline-block; width: 22px; height: 0; vertical-align: middle; margin-right: 5px; }
.blue-key { border-top: 3px solid #247ad7; }
.red-key { border-top: 3px dashed #d45555; }
.current-step { margin-left: auto; color: #51617b; }
</style>
