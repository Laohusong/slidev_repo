<template>
  <div class="minimum-figure">
    <svg viewBox="0 0 650 410" role="img" aria-label="Five-step tangent animation comparing arbitrary and selected source directions">
      <defs>
        <marker id="mn-blue-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#216bb3" /></marker>
        <marker id="mn-red-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#b94c59" /></marker>
        <marker id="mn-purple-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#7951a6" /></marker>
        <marker id="mn-orange-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c77725" /></marker>
        <marker id="mn-green-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#25825d" /></marker>
      </defs>
      <line x1="60" y1="240" x2="628" y2="240" class="axis" />
      <line x1="60" y1="240" x2="60" y2="28" class="axis" />
      <text x="626" y="261" class="axis-label">x</text>
      <text x="42" y="36" class="axis-label">y</text>
      <path :d="curvePath" class="curve-guide" />
      <path :d="orbitPath" class="orbit-path" />
      <text x="135" y="51" class="curve-label">y = sin x</text>
      <circle :cx="px(x0)" :cy="py(1)" r="3" class="start-point" />
      <text :x="px(x0) + 8" :y="py(1) - 10" class="curve-label">n = 0</text>
      <text :x="px(sourceX) - 18" :y="py(Math.sin(sourceX)) + 23" class="curve-label">source</text>
      <text :x="px(Math.PI) - 18" :y="py(0) + 21" class="curve-label">n = −1</text>

      <g v-if="reveal > .02">
        <line :x1="lerp(baseX, px(x - .36), reveal)" :y1="lerp(baseY, py(y - .36 * slope), reveal)" :x2="lerp(baseX, px(x + .36), reveal)" :y2="lerp(baseY, py(y + .36 * slope), reveal)" class="stable-axis" />
        <line :x1="baseX" :y1="lerp(baseY, py(y - .43), reveal)" :x2="baseX" :y2="lerp(baseY, py(y + .43), reveal)" class="unstable-axis" />
      </g>

      <g v-if="stage <= 1 && decompose > .02">
        <line :x1="baseX" :y1="baseY" :x2="lerp(baseX, arbitraryStableX, decompose)" :y2="lerp(baseY, arbitraryStableY, decompose)" class="stable-vector" :marker-end="decompose > .35 ? 'url(#mn-blue-tip)' : undefined" />
        <line :x1="arbitraryStableX" :y1="arbitraryStableY" :x2="lerp(arbitraryStableX, arbitraryTargetX, decompose)" :y2="lerp(arbitraryStableY, arbitraryTargetY, decompose)" class="unstable-vector" :marker-end="decompose > .35 ? 'url(#mn-red-tip)' : undefined" />
        <line :x1="baseX" :y1="baseY" :x2="lerp(baseX, arbitraryTargetX, decompose)" :y2="lerp(baseY, arbitraryTargetY, decompose)" class="total-vector" :marker-end="decompose > .35 ? 'url(#mn-purple-tip)' : undefined" />
      </g>
      <g v-if="stage === 2 && decompose > .02">
        <line :x1="baseX" :y1="baseY" :x2="lerp(baseX, pureX, decompose)" :y2="lerp(baseY, pureY, decompose)" class="unstable-vector" :marker-end="decompose > .35 ? 'url(#mn-red-tip)' : undefined" />
      </g>
      <g v-if="stage >= 3 && sourceMode !== 'after'">
        <line :x1="baseX" :y1="baseY" :x2="pureX" :y2="pureY" class="total-vector" marker-end="url(#mn-purple-tip)" />
      </g>
      <g v-if="stage >= 3 && sourceMode === 'compose'">
        <line v-if="orangeProgress > .03" :x1="baseX" :y1="baseY" :x2="lerp(baseX, sourceTipX, orangeProgress)" :y2="lerp(baseY, sourceTipY, orangeProgress)" class="source-vector" marker-end="url(#mn-orange-tip)" />
        <line v-if="parallelProgress > 0" :x1="pureX" :y1="pureY" :x2="lerp(pureX, postX, parallelProgress)" :y2="lerp(pureY, postY, parallelProgress)" class="parallelogram" />
        <line v-if="parallelProgress > 0" :x1="sourceTipX" :y1="sourceTipY" :x2="lerp(sourceTipX, postX, parallelProgress)" :y2="lerp(sourceTipY, postY, parallelProgress)" class="parallelogram" />
        <line v-if="greenProgress > .03" :x1="baseX" :y1="baseY" :x2="lerp(baseX, postX, greenProgress)" :y2="lerp(baseY, postY, greenProgress)" class="post-vector" marker-end="url(#mn-green-tip)" />
        <text v-if="orangeProgress > .9" :x="sourceTipX - 12" :y="sourceTipY - 8" class="source-label">w</text>
        <text v-if="greenProgress > .95" :x="postX + 7" :y="postY - 8" class="post-label">v + w</text>
      </g>
      <g v-if="stage >= 3 && sourceMode === 'after'">
        <line :x1="baseX" :y1="baseY" :x2="postX" :y2="postY" class="post-vector" marker-end="url(#mn-green-tip)" />
      </g>
      <circle :cx="baseX" :cy="baseY" r="6.2" class="reference-point" />

      <g class="norm-chart">
        <text x="359" y="269" class="chart-title">Component norms</text>
        <line x1="361" y1="375" x2="625" y2="375" class="chart-axis" />
        <line x1="361" y1="296" x2="361" y2="375" class="chart-axis" />
        <line v-for="i in 4" :key="i" x1="361" :y1="chartY((i - 1) * chartMax / 3)" x2="625" :y2="chartY((i - 1) * chartMax / 3)" class="chart-grid" />
        <line :x1="chartX(2)" y1="296" :x2="chartX(2)" y2="375" class="source-time" />
        <path :d="stablePath" class="stable-plot" />
        <path :d="unstablePath" class="unstable-plot" />
        <circle :cx="chartX(time)" :cy="chartY(currentStableNorm)" r="2.8" class="stable-dot" />
        <circle :cx="chartX(time)" :cy="chartY(currentUnstableNorm)" r="2.8" class="unstable-dot" />
        <text x="355" y="392" class="chart-label">−1</text>
        <text :x="chartX(0) - 3" y="392" class="chart-label">0</text>
        <text :x="chartX(2) - 3" y="392" class="chart-label">2</text>
        <text x="619" y="392" class="chart-label">4</text>
        <text x="489" y="400" class="chart-label">time n</text>
        <line x1="477" y1="281" x2="492" y2="281" class="stable-legend" />
        <text x="495" y="285" class="chart-label">stable</text>
        <line x1="548" y1="281" x2="563" y2="281" class="unstable-legend" />
        <text x="566" y="285" class="chart-label">unstable</text>
        <g v-if="stage === 1 && time < -.86" class="result-mark">
          <line :x1="chartX(-.78) - 11" :y1="chartY(arbitraryStableNorm(-.78)) - 11" :x2="chartX(-.78) + 11" :y2="chartY(arbitraryStableNorm(-.78)) + 11" />
          <line :x1="chartX(-.78) + 11" :y1="chartY(arbitraryStableNorm(-.78)) - 11" :x2="chartX(-.78) - 11" :y2="chartY(arbitraryStableNorm(-.78)) + 11" />
        </g>
        <g v-if="stage === 3 && sourceMode === 'after' && time > 3.87" class="result-mark">
          <line :x1="chartX(3.67) - 11" :y1="chartY(postUnstableNorm(3.67)) - 11" :x2="chartX(3.67) + 11" :y2="chartY(postUnstableNorm(3.67)) + 11" />
          <line :x1="chartX(3.67) + 11" :y1="chartY(postUnstableNorm(3.67)) - 11" :x2="chartX(3.67) - 11" :y2="chartY(postUnstableNorm(3.67)) + 11" />
        </g>
        <g v-if="stage === 4 && sourceMode === 'after' && time > 3.87" class="result-mark">
          <path d="M 590 357 L 600 366 L 618 344" />
        </g>
      </g>
    </svg>
    <div class="minimum-controls">
      <span class="caption">{{ captions[stage] }}</span>
      <button type="button" @click.stop="replay" aria-label="Replay current animation step">↻</button>
      <button type="button" @click.stop="setStage(stage - 1)" :disabled="stage === 0" aria-label="Previous animation step">‹</button>
      <span class="count">{{ stage + 1 }} / 5</span>
      <button type="button" @click.stop="setStage(stage + 1)" :disabled="stage === 4" aria-label="Next animation step">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const x0 = Math.PI / 2
const sourceX = x0 / 4
const arbitraryA = -.12
const arbitraryB = .10
const pureB = .20
const genericSource = { x: -.10, y: .10 }
const selectedSource = { x: -.18, y: -.18 * Math.cos(sourceX) - 4 * pureB }
const stage = ref(0)
const time = ref(0)
const reveal = ref(0)
const decompose = ref(0)
const compose = ref(0)
const sourceMode = ref<'approach' | 'compose' | 'after'>('approach')
const captions = [
  '1. Split a perturbation and carry both components to the source.',
  '2. Rewind: the stable component grows and must be discarded.',
  '3. A purely unstable perturbation decays in negative time.',
  '4. A generic source leaves an unstable part that grows forward.',
  '5. Choose the source direction to cancel the unstable part.',
]
const px = (value: number) => 60 + 175 * value
const py = (value: number) => 240 - 125 * value
const lerp = (from: number, to: number, fraction: number) => from + (to - from) * fraction
const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => value * value * (3 - 2 * value)
function pathForCurve(start: number, end: number) {
  return Array.from({ length: 130 }, (_, i) => {
    const value = start + (end - start) * i / 129
    return (i ? 'L ' : 'M ') + px(value).toFixed(1) + ' ' + py(Math.sin(value)).toFixed(1)
  }).join(' ')
}
const curvePath = computed(() => pathForCurve(.07, Math.PI))
const orbitPath = computed(() => pathForCurve(x0 / 16, Math.PI))
const x = computed(() => x0 / 2 ** time.value)
const y = computed(() => Math.sin(x.value))
const slope = computed(() => Math.cos(x.value))
const baseX = computed(() => px(x.value))
const baseY = computed(() => py(y.value))
function vectorTip(stable: number, unstable: number) {
  return [px(x.value + stable), py(y.value + stable * slope.value + unstable)]
}
const arbitraryStable = (n: number) => arbitraryA / 2 ** n
const arbitraryUnstable = (n: number) => arbitraryB * 2 ** n
const pureUnstable = (n: number) => pureB * 2 ** n
const arbitraryStableX = computed(() => vectorTip(arbitraryStable(time.value), 0)[0])
const arbitraryStableY = computed(() => vectorTip(arbitraryStable(time.value), 0)[1])
const arbitraryTargetX = computed(() => vectorTip(arbitraryStable(time.value), arbitraryUnstable(time.value))[0])
const arbitraryTargetY = computed(() => vectorTip(arbitraryStable(time.value), arbitraryUnstable(time.value))[1])
const pureX = computed(() => baseX.value)
const pureY = computed(() => py(y.value + pureUnstable(time.value)))
const source = computed(() => stage.value === 4 ? selectedSource : genericSource)
const sourceTipX = computed(() => px(x.value + source.value.x))
const sourceTipY = computed(() => py(y.value + source.value.y))
const sourceStable = computed(() => source.value.x)
const sourceUnstable = computed(() => source.value.y - source.value.x * Math.cos(sourceX))
const postStable = (n: number) => sourceStable.value / 2 ** (n - 2)
const postUnstable = (n: number) => (pureUnstable(2) + sourceUnstable.value) * 2 ** (n - 2)
const postX = computed(() => vectorTip(postStable(time.value), postUnstable(time.value))[0])
const postY = computed(() => vectorTip(postStable(time.value), postUnstable(time.value))[1])
const segment = (start: number, end: number) => smooth(clamp01((compose.value - start) / (end - start)))
const orangeProgress = computed(() => segment(0, .33))
const parallelProgress = computed(() => segment(.33, .67))
const greenProgress = computed(() => segment(.67, 1))

const chartX = (n: number) => 361 + 264 * (n + 1) / 5
const chartMax = computed(() => stage.value === 3 ? 4.2 : 1.5)
const chartY = (norm: number) => 375 - 70 * norm / chartMax.value
const stableNorm = (coefficient: number, n: number) => Math.abs(coefficient) * Math.hypot(1, Math.cos(x0 / 2 ** n))
const arbitraryStableNorm = (n: number) => stableNorm(arbitraryStable(n), n)
const arbitraryUnstableNorm = (n: number) => Math.abs(arbitraryUnstable(n))
const pureStableNorm = (_n: number) => 0
const pureUnstableNorm = (n: number) => Math.abs(pureUnstable(n))
const postStableNorm = (n: number) => stableNorm(postStable(n), n)
const postUnstableNorm = (n: number) => Math.abs(postUnstable(n))
const currentStableNorm = computed(() => {
  if (stage.value <= 1) return arbitraryStableNorm(time.value)
  if (stage.value === 2 || sourceMode.value === 'approach') return 0
  if (sourceMode.value === 'compose') return stableNorm(sourceStable.value * orangeProgress.value, 2)
  return postStableNorm(time.value)
})
const currentUnstableNorm = computed(() => {
  if (stage.value <= 1) return arbitraryUnstableNorm(time.value)
  if (stage.value === 2 || sourceMode.value === 'approach') return pureUnstableNorm(time.value)
  if (sourceMode.value === 'compose') return Math.abs(pureUnstable(2) + sourceUnstable.value * orangeProgress.value)
  return postUnstableNorm(time.value)
})
function pathFrom(points: [number, number][]) {
  return points.map(([n, value], i) => (i ? 'L ' : 'M ') + chartX(n).toFixed(1) + ' ' + chartY(value).toFixed(1)).join(' ')
}
function sampled(from: number, to: number, norm: (n: number) => number) {
  return Array.from({ length: 61 }, (_, i): [number, number] => {
    const n = from + (to - from) * i / 60
    return [n, norm(n)]
  })
}
function normPath(kind: 'stable' | 'unstable') {
  const arbitrary = kind === 'stable' ? arbitraryStableNorm : arbitraryUnstableNorm
  const pure = kind === 'stable' ? pureStableNorm : pureUnstableNorm
  const post = kind === 'stable' ? postStableNorm : postUnstableNorm
  if (stage.value === 0) return pathFrom(sampled(0, time.value, arbitrary))
  if (stage.value === 1) return pathFrom(sampled(Math.min(time.value, 0), 2, arbitrary))
  if (stage.value === 2) return pathFrom(sampled(time.value, 0, pure))
  if (sourceMode.value === 'approach') return pathFrom(sampled(-1, time.value, pure))
  const points = sampled(-1, 2, pure)
  if (sourceMode.value === 'compose') {
    points.push([2, kind === 'stable' ? currentStableNorm.value : currentUnstableNorm.value])
  } else {
    points.push([2, post(2)], ...sampled(2, time.value, post))
  }
  return pathFrom(points)
}
const stablePath = computed(() => normPath('stable'))
const unstablePath = computed(() => normPath('unstable'))

let frame = 0
let start = 0
function tick(now: number) {
  const elapsed = now - start
  if (stage.value === 0) {
    reveal.value = smooth(clamp01(elapsed / 1000))
    decompose.value = smooth(clamp01((elapsed - 650) / 1100))
    time.value = 2 * smooth(clamp01((elapsed - 1900) / 3800))
  } else if (stage.value === 1) {
    time.value = 2 - 3 * smooth(clamp01(elapsed / 5700))
  } else if (stage.value === 2) {
    decompose.value = smooth(clamp01(elapsed / 800))
    time.value = -smooth(clamp01((elapsed - 800) / 4400))
  } else if (elapsed < 3600) {
    sourceMode.value = 'approach'
    time.value = -1 + 3 * smooth(clamp01(elapsed / 3600))
  } else if (elapsed < 7200) {
    sourceMode.value = 'compose'
    time.value = 2
    compose.value = clamp01((elapsed - 3600) / 3600)
  } else {
    sourceMode.value = 'after'
    compose.value = 1
    time.value = 2 + 2 * smooth(clamp01((elapsed - 7200) / 3600))
  }
  const duration = stage.value === 2 ? 5200 : stage.value >= 3 ? 10800 : 5700
  if (elapsed < duration) frame = requestAnimationFrame(tick)
}
function setStage(next: number) {
  cancelAnimationFrame(frame)
  stage.value = Math.max(0, Math.min(4, next))
  start = performance.now()
  time.value = stage.value === 0 || stage.value === 2 ? 0 : stage.value === 1 ? 2 : -1
  reveal.value = stage.value === 0 ? 0 : 1
  decompose.value = stage.value === 0 || stage.value === 2 ? 0 : 1
  compose.value = 0
  sourceMode.value = 'approach'
  frame = requestAnimationFrame(tick)
}
function replay() { setStage(stage.value) }
onMounted(() => { start = performance.now(); frame = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(frame))
</script>

<style scoped>
.minimum-figure { width: 100%; color: #34445e; }
svg { display: block; width: 100%; height: 330px; }
.axis, .chart-axis { stroke: #73849a; stroke-width: 1.25; }
.axis-label, .curve-label { fill: #56677f; font: 14px Georgia, serif; }
.curve-guide { fill: none; stroke: #b9c8d9; stroke-width: 1.6; }
.orbit-path { fill: none; stroke: #202a35; stroke-width: 2.6; }
.start-point { fill: #5a6777; }
.reference-point { fill: #151a20; stroke: white; stroke-width: 1.7; }
.stable-axis { stroke: #216bb3; stroke-width: 2; stroke-dasharray: 7 5; }
.unstable-axis { stroke: #b94c59; stroke-width: 2; stroke-dasharray: 7 5; }
.stable-vector { stroke: #216bb3; stroke-width: 3; }
.unstable-vector { stroke: #b94c59; stroke-width: 3; }
.total-vector { stroke: #7951a6; stroke-width: 2.5; }
.source-vector { stroke: #c77725; stroke-width: 2.6; }
.post-vector { stroke: #25825d; stroke-width: 2.8; }
.parallelogram { stroke: #9aa7b5; stroke-width: 1.3; stroke-dasharray: 4 4; }
.source-label, .post-label { font: 14px Georgia, serif; }
.source-label { fill: #ad621b; }
.post-label { fill: #217450; }
.chart-title { fill: #34445e; font: 14px Georgia, serif; }
.chart-label { fill: #52627a; font: 11px Georgia, serif; }
.chart-grid { stroke: #e2e8ef; stroke-width: .8; }
.source-time { stroke: #202a35; stroke-width: 1.1; stroke-dasharray: 4 4; }
.stable-plot, .unstable-plot { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.stable-plot, .stable-legend { stroke: #216bb3; }
.unstable-plot, .unstable-legend { stroke: #b94c59; }
.stable-legend, .unstable-legend { stroke-width: 2.4; }
.stable-dot { fill: #216bb3; }
.unstable-dot { fill: #b94c59; }
.result-mark { stroke: #d12131; stroke-width: 4.5; stroke-linecap: round; stroke-linejoin: round; fill: none; }
.minimum-controls { display: flex; align-items: center; gap: .5rem; border-top: 1px solid #c9d3df; padding: .35rem 0; font-size: .79rem; }
.caption { flex: 1; }
.count { min-width: 2.2rem; text-align: center; }
button { color: #1e5b9d; border: 1px solid #a7b8cd; border-radius: 4px; padding: .05rem .5rem; font-size: 1.3rem; line-height: 1.1; background: #f4f7fb; cursor: pointer; }
button:disabled { opacity: .35; cursor: default; }
</style>
