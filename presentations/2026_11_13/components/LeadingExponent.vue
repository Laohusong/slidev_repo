<template>
  <div class="leading-exponent-figure">
    <svg viewBox="0 0 1080 220" role="img" aria-label="Animated schematic: log separation grows linearly in time with slope equal to the leading Lyapunov exponent">
      <g class="plot-grid">
        <line v-for="n in 5" :key="n" :x1="90 + n * 175" y1="25" :x2="90 + n * 175" y2="175" />
        <line v-for="n in 3" :key="`h${n}`" x1="90" :y1="175 - n * 50" x2="990" :y2="175 - n * 50" />
      </g>
      <g class="axes">
        <line x1="90" y1="175" x2="1005" y2="175" />
        <line x1="90" y1="175" x2="90" y2="20" />
      </g>
      <text x="550" y="210" text-anchor="middle" class="axis-label">elapsed time</text>
      <text x="29" y="105" text-anchor="middle" transform="rotate(-90 29 105)" class="axis-label">log separation</text>
      <text x="76" y="193" text-anchor="end" class="tick-label">0</text>
      <line x1="90" y1="175" x2="990" y2="35" class="growth-line" />
      <line x1="90" y1="175" :x2="pointX" :y2="pointY" class="active-line" />
      <circle :cx="pointX" :cy="pointY" r="8" class="moving-point" />
      <line :x1="pointX" y1="175" :x2="pointX" :y2="pointY" class="separation-marker" />
      <text x="690" y="67" class="slope-label">slope: leading exponent</text>
      <text x="720" y="159" class="regime-label">chaotic regime · g &gt; 1</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)
const pointX = computed(() => 90 + 900 * progress.value)
const pointY = computed(() => 175 - 140 * progress.value)
let frame = 0
let start = 0
function animate(now: number) {
  if (!start) start = now
  const cycle = ((now - start) % 6500) / 6500
  progress.value = Math.min(cycle * 1.15, 1)
  frame = requestAnimationFrame(animate)
}
onMounted(() => { frame = requestAnimationFrame(animate) })
onUnmounted(() => { cancelAnimationFrame(frame) })
</script>

<style scoped>
.leading-exponent-figure { width: 100%; }
svg { display: block; width: 100%; height: 205px; }
.plot-grid line { stroke: #d7dfe9; stroke-width: 1; }
.axes line { stroke: #53647d; stroke-width: 1.8; }
.axis-label { fill: #34445e; font: 19px Georgia, serif; }
.tick-label { fill: #53647d; font: 15px Georgia, serif; }
.growth-line { stroke: #7da7d4; stroke-width: 2.4; stroke-dasharray: 7 7; }
.active-line { stroke: #2167bd; stroke-width: 4; }
.moving-point { fill: #2167bd; stroke: white; stroke-width: 2; }
.separation-marker { stroke: #6a83a5; stroke-width: 1.5; stroke-dasharray: 5 5; }
.slope-label { fill: #174f99; font: 20px Georgia, serif; }
.regime-label { fill: #53647d; font: 16px Georgia, serif; }
</style>
