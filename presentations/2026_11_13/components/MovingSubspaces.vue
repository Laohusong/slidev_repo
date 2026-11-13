<template>
  <div class="subspace-figure">
    <svg viewBox="0 0 650 410" role="img" aria-label="Four-step animation of the reference orbit, moving invariant directions, perturbation decomposition, and component norms">
      <defs>
        <marker id="blue-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#216bb3" /></marker>
        <marker id="red-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#b94c59" /></marker>
        <marker id="purple-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#7951a6" /></marker>
      </defs>
      <line x1="62" y1="248" x2="632" y2="248" class="axis" />
      <line x1="62" y1="248" x2="62" y2="30" class="axis" />
      <text x="629" y="269" class="axis-label">x</text>
      <text x="43" y="37" class="axis-label">y</text>
      <path :d="fullCurve" class="curve-guide" />
      <path :d="orbitCurve" class="orbit-curve" />
      <text x="83" y="55" class="curve-label">y = sin x</text>
      <circle :cx="px(x0)" :cy="py(1)" r="3.3" class="orbit-point" />
      <text :x="px(x0) + 8" :y="py(1) - 11" class="point-label">n = 0</text>

      <g v-if="stage >= 1">
        <line :x1="px(x - .37)" :y1="py(y - .37 * slope)" :x2="px(x + .37)" :y2="py(y + .37 * slope)" class="stable-direction" />
        <line :x1="px(x)" :y1="py(y - .50)" :x2="px(x)" :y2="py(y + .50)" class="unstable-direction" />
        <text :x="Math.min(px(x + .37) + 5, 608)" :y="py(y + .37 * slope) + 2" class="stable-label">E st</text>
        <text :x="px(x) + 8" :y="py(y - .45) + 5" class="unstable-label">E un</text>
      </g>

      <g v-if="stage >= 2">
        <line :x1="baseX" :y1="baseY" :x2="lerp(baseX, targetX, vectorReveal)" :y2="lerp(baseY, targetY, vectorReveal)" class="perturbation" :marker-end="vectorReveal > .35 ? 'url(#purple-tip)' : undefined" />
        <line :x1="baseX" :y1="baseY" :x2="lerp(baseX, stableX, vectorReveal)" :y2="lerp(baseY, stableY, vectorReveal)" class="stable-vector" :marker-end="vectorReveal > .35 ? 'url(#blue-tip)' : undefined" />
        <line :x1="stableX" :y1="stableY" :x2="lerp(stableX, targetX, vectorReveal)" :y2="lerp(stableY, targetY, vectorReveal)" class="unstable-vector" :marker-end="vectorReveal > .35 ? 'url(#red-tip)' : undefined" />
        <circle v-if="vectorReveal > .95" :cx="targetX" :cy="targetY" r="3.4" class="perturbed-point" />
        <text v-if="stage === 2 && vectorReveal > .95" :x="targetX + 8" :y="targetY - 7" class="perturb-label">w</text>
        <text v-if="stage === 2 && vectorReveal > .95" :x="stableX - 10" :y="stableY + 24" class="stable-label">w st</text>
        <text v-if="stage === 2 && vectorReveal > .95" :x="stableX + 8" :y="(stableY + targetY) / 2" class="unstable-label">w un</text>
      </g>
      <circle :cx="baseX" :cy="baseY" r="6.4" class="reference-point" />

      <g v-if="stage === 3">
        <text x="360" y="270" class="chart-title">Norm of each component</text>
        <line x1="361" y1="374" x2="625" y2="374" class="chart-axis" />
        <line x1="361" y1="296" x2="361" y2="374" class="chart-axis" />
        <line v-for="i in 4" :key="i" x1="361" :y1="chartY((i - 1) / 3)" x2="625" :y2="chartY((i - 1) / 3)" class="chart-grid" />
        <path :d="stablePath" class="chart-stable" />
        <path :d="unstablePath" class="chart-unstable" />
        <line :x1="chartX(progress)" y1="296" :x2="chartX(progress)" y2="374" class="chart-cursor" />
        <circle :cx="chartX(progress)" :cy="chartY(stableNorm(progress))" r="3" class="chart-stable-dot" />
        <circle :cx="chartX(progress)" :cy="chartY(unstableNorm(progress))" r="3" class="chart-unstable-dot" />
        <text x="358" y="390" class="chart-label">0</text>
        <text x="618" y="390" class="chart-label">3</text>
        <text x="485" y="399" class="chart-label">time n</text>
        <text x="366" y="308" class="chart-label">1</text>
        <line x1="451" y1="284" x2="468" y2="284" class="legend-stable" />
        <text x="471" y="288" class="chart-label">stable</text>
        <line x1="532" y1="284" x2="549" y2="284" class="legend-unstable" />
        <text x="552" y="288" class="chart-label">unstable</text>
      </g>
    </svg>
    <div class="subspace-controls">
      <span class="step-caption">{{ captions[stage] }}</span>
      <button type="button" @click.stop="replay" aria-label="Replay current animation step">↻</button>
      <button type="button" @click.stop="back" :disabled="stage === 0" aria-label="Previous animation step">‹</button>
      <span class="step-count">{{ stage + 1 }} / 4</span>
      <button type="button" @click.stop="next" :disabled="stage === 3" aria-label="Next animation step">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const x0 = Math.PI / 2
const orbitPoints = Array.from({ length: 4 }, (_, n) => x0 / 2 ** n)
const stage = ref(0)
const progress = ref(0)
const vectorReveal = ref(1)
const a = .22
const b = .13
const captions = [
  '1. The black point follows the reference orbit.',
  '2. Stable and unstable directions move with the point.',
  '3. At n = 0, decompose a perturbation into both directions.',
  '4. Transport both components; their norms decay and grow.',
]
const px = (x: number) => 62 + 292 * x
const py = (y: number) => 248 - 168 * y
function pathForCurve(start: number, end: number) {
  return Array.from({ length: 100 }, (_, i) => {
    const x = start + (end - start) * i / 99
    return (i ? 'L ' : 'M ') + px(x).toFixed(1) + ' ' + py(Math.sin(x)).toFixed(1)
  }).join(' ')
}
const fullCurve = computed(() => pathForCurve(.08, 1.9))
const orbitCurve = computed(() => pathForCurve(orbitPoints[3], x0))
const x = computed(() => x0 / 2 ** progress.value)
const y = computed(() => Math.sin(x.value))
const slope = computed(() => Math.cos(x.value))
const stableDx = computed(() => a / 2 ** progress.value)
const unstableDy = computed(() => b * 2 ** progress.value)
const baseX = computed(() => px(x.value))
const baseY = computed(() => py(y.value))
const stableX = computed(() => px(x.value + stableDx.value))
const stableY = computed(() => py(y.value + stableDx.value * slope.value))
const targetX = computed(() => stableX.value)
const targetY = computed(() => py(y.value + stableDx.value * slope.value + unstableDy.value))
const stableNorm = (n: number) => a / 2 ** n * Math.hypot(1, Math.cos(x0 / 2 ** n))
const unstableNorm = (n: number) => b * 2 ** n
const chartX = (n: number) => 361 + 264 * n / 3
const chartY = (norm: number) => 374 - 72 * norm / 1.1
const lerp = (from: number, to: number, fraction: number) => from + (to - from) * fraction
function normPath(norm: (n: number) => number) {
  const end = progress.value
  const samples = [0, 1, 2, 3].filter(n => n < end)
  if (!samples.length || samples[samples.length - 1] !== end) samples.push(end)
  return samples.map((n, i) => (i ? 'L ' : 'M ') + chartX(n).toFixed(1) + ' ' + chartY(norm(n)).toFixed(1)).join(' ')
}
const stablePath = computed(() => normPath(stableNorm))
const unstablePath = computed(() => normPath(unstableNorm))

let animationFrame = 0
let startTime = 0
const duration = 5600
function tick(now: number) {
  const elapsed = now - startTime
  if (stage.value === 2) {
    vectorReveal.value = Math.min(1, elapsed / 1100)
  } else {
    const phase = Math.min(1, elapsed / duration)
    progress.value = phase < .13 ? 0 : phase > .88 ? 3 : 3 * (phase - .13) / .75
  }
  if (elapsed < (stage.value === 2 ? 1100 : duration)) animationFrame = requestAnimationFrame(tick)
}
function setStage(nextStage: number) {
  cancelAnimationFrame(animationFrame)
  stage.value = nextStage
  progress.value = 0
  vectorReveal.value = nextStage === 2 ? 0 : 1
  startTime = performance.now()
  animationFrame = requestAnimationFrame(tick)
}
function back() { setStage(Math.max(0, stage.value - 1)) }
function next() { setStage(Math.min(3, stage.value + 1)) }
function replay() { setStage(stage.value) }
onMounted(() => { startTime = performance.now(); animationFrame = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(animationFrame))
</script>

<style scoped>
.subspace-figure { width: 100%; color: #34445e; }
svg { display: block; width: 100%; height: 330px; }
.axis, .chart-axis { stroke: #73849a; stroke-width: 1.25; }
.axis-label, .curve-label, .point-label { fill: #56677f; font: 14px Georgia, serif; }
.curve-guide { fill: none; stroke: #b9c8d9; stroke-width: 1.6; }
.orbit-curve { fill: none; stroke: #202a35; stroke-width: 2.6; }
.orbit-point { fill: #5a6777; }
.reference-point { fill: #151a20; stroke: white; stroke-width: 1.7; }
.stable-direction { stroke: #216bb3; stroke-width: 2.1; stroke-dasharray: 7 5; }
.unstable-direction { stroke: #b94c59; stroke-width: 2.1; stroke-dasharray: 7 5; }
.stable-vector { stroke: #216bb3; stroke-width: 3.1; }
.unstable-vector { stroke: #b94c59; stroke-width: 3.1; }
.perturbation { stroke: #7951a6; stroke-width: 2.6; }
.perturbed-point { fill: #7951a6; }
.stable-label, .unstable-label, .perturb-label { font: 13px Georgia, serif; }
.stable-label { fill: #216bb3; }
.unstable-label { fill: #a53e4e; }
.perturb-label { fill: #7951a6; }
.chart-title { fill: #34445e; font: 14px Georgia, serif; }
.chart-label { fill: #52627a; font: 11px Georgia, serif; }
.chart-grid { stroke: #e2e8ef; stroke-width: .8; }
.chart-cursor { stroke: #8b9bad; stroke-width: 1; stroke-dasharray: 3 3; }
.chart-stable, .chart-unstable { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.chart-stable, .legend-stable { stroke: #216bb3; }
.chart-unstable, .legend-unstable { stroke: #b94c59; }
.legend-stable, .legend-unstable { stroke-width: 2.4; }
.chart-stable-dot { fill: #216bb3; }
.chart-unstable-dot { fill: #b94c59; }
.subspace-controls { display: flex; align-items: center; gap: .5rem; border-top: 1px solid #c9d3df; padding: .35rem 0; font-size: .79rem; }
.step-caption { flex: 1; }
.step-count { min-width: 2.2rem; text-align: center; }
button { color: #1e5b9d; border: 1px solid #a7b8cd; border-radius: 4px; padding: .05rem .5rem; font-size: 1.3rem; line-height: 1.1; background: #f4f7fb; cursor: pointer; }
button:disabled { opacity: .35; cursor: default; }
</style>
