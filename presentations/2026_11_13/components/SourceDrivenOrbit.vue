<template>
  <div class="source-figure">
    <svg viewBox="0 0 650 410" role="img" aria-label="A perturbation propagates along a reference orbit, receives a localized source, and continues with changed stable and unstable component norms">
      <defs>
        <marker id="source-purple-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#7951a6" /></marker>
        <marker id="source-orange-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#c77725" /></marker>
        <marker id="source-green-tip" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#25825d" /></marker>
      </defs>
      <line x1="62" y1="248" x2="632" y2="248" class="axis" />
      <line x1="62" y1="248" x2="62" y2="28" class="axis" />
      <text x="629" y="269" class="axis-label">x</text>
      <text x="43" y="36" class="axis-label">y</text>
      <path :d="fullCurve" class="curve-guide" />
      <path :d="orbitCurve" class="orbit-curve" />
      <text x="84" y="55" class="curve-label">y = sin x</text>
      <circle :cx="px(x0)" :cy="py(1)" r="3.2" class="start-point" />
      <text :x="px(x0) + 8" :y="py(1) - 11" class="curve-label">n = 0</text>
      <text :x="px(sourceX) - 9" :y="py(Math.sin(sourceX)) + 22" class="curve-label">n = k + 1</text>

      <g v-if="stage < 2">
        <line :x1="baseX" :y1="baseY" :x2="preX" :y2="preY" class="purple-vector" marker-end="url(#source-purple-tip)" />
        <text v-if="stage === 0" :x="preX + 7" :y="preY - 8" class="purple-label">v</text>
      </g>
      <g v-if="stage === 1">
        <line v-if="orangeProgress > .03" :x1="baseX" :y1="baseY" :x2="lerp(baseX, sourceTipX, orangeProgress)" :y2="lerp(baseY, sourceTipY, orangeProgress)" class="orange-vector" marker-end="url(#source-orange-tip)" />
        <line v-if="constructionProgress > 0" :x1="preX" :y1="preY" :x2="lerp(preX, postX, constructionProgress)" :y2="lerp(preY, postY, constructionProgress)" class="parallelogram" />
        <line v-if="constructionProgress > 0" :x1="sourceTipX" :y1="sourceTipY" :x2="lerp(sourceTipX, postX, constructionProgress)" :y2="lerp(sourceTipY, postY, constructionProgress)" class="parallelogram" />
        <line v-if="greenProgress > .03" :x1="baseX" :y1="baseY" :x2="lerp(baseX, postX, greenProgress)" :y2="lerp(baseY, postY, greenProgress)" class="green-vector" marker-end="url(#source-green-tip)" />
        <text v-if="orangeProgress > .9" :x="sourceTipX - 13" :y="sourceTipY - 8" class="orange-label">w</text>
        <text v-if="greenProgress > .95" :x="postX - 3" :y="postY - 9" class="green-label">v + w</text>
      </g>
      <g v-if="stage === 2">
        <line :x1="baseX" :y1="baseY" :x2="postX" :y2="postY" class="green-vector" marker-end="url(#source-green-tip)" />
        <text :x="postX + 7" :y="postY - 8" class="green-label">v</text>
      </g>
      <circle :cx="baseX" :cy="baseY" r="6.2" class="moving-point" />

      <g class="norm-chart">
        <text x="359" y="270" class="chart-title">Component norms</text>
        <line x1="361" y1="374" x2="625" y2="374" class="chart-axis" />
        <line x1="361" y1="296" x2="361" y2="374" class="chart-axis" />
        <line v-for="i in 4" :key="i" x1="361" :y1="chartY((i - 1) / 3)" x2="625" :y2="chartY((i - 1) / 3)" class="chart-grid" />
        <line :x1="chartX(2)" y1="293" :x2="chartX(2)" y2="374" class="source-time" />
        <path :d="stablePath" class="stable-plot" />
        <path :d="unstablePath" class="unstable-plot" />
        <circle :cx="chartX(time)" :cy="chartY(stableNow)" r="2.8" class="stable-dot" />
        <circle :cx="chartX(time)" :cy="chartY(unstableNow)" r="2.8" class="unstable-dot" />
        <text x="357" y="391" class="chart-label">0</text>
        <text :x="chartX(2) - 3" y="391" class="chart-label">2</text>
        <text x="619" y="391" class="chart-label">4</text>
        <text x="489" y="400" class="chart-label">time n</text>
        <text :x="chartX(2) + 5" y="305" class="source-label">source</text>
        <line x1="477" y1="281" x2="492" y2="281" class="stable-legend" />
        <text x="495" y="285" class="chart-label">stable</text>
        <line x1="548" y1="281" x2="563" y2="281" class="unstable-legend" />
        <text x="566" y="285" class="chart-label">unstable</text>
      </g>
    </svg>
    <div class="source-controls">
      <span class="caption">{{ captions[stage] }}</span>
      <button type="button" @click.stop="replay" aria-label="Replay current animation step">↻</button>
      <button type="button" @click.stop="setStage(stage - 1)" :disabled="stage === 0" aria-label="Previous animation step">‹</button>
      <span class="count">{{ stage + 1 }} / 3</span>
      <button type="button" @click.stop="setStage(stage + 1)" :disabled="stage === 2" aria-label="Next animation step">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const x0 = Math.PI / 2
const sourceX = x0 / 4
const a = .20
const b = .025
const sourceA = -.07
const sourceB = .08
const stage = ref(0)
const time = ref(0)
const compose = ref(0)
const captions = [
  '1. An initial perturbation follows the reference orbit to n = k + 1.',
  '2. The localized source w adds to the transported perturbation.',
  '3. The combined perturbation continues along the orbit.',
]
const px = (x: number) => 62 + 292 * x
const py = (y: number) => 248 - 168 * y
function curvePath(start: number, end: number) {
  return Array.from({ length: 100 }, (_, i) => {
    const x = start + (end - start) * i / 99
    return (i ? 'L ' : 'M ') + px(x).toFixed(1) + ' ' + py(Math.sin(x)).toFixed(1)
  }).join(' ')
}
const fullCurve = computed(() => curvePath(.06, 1.9))
const orbitCurve = computed(() => curvePath(x0 / 16, x0))
const x = computed(() => x0 / 2 ** time.value)
const y = computed(() => Math.sin(x.value))
const baseX = computed(() => px(x.value))
const baseY = computed(() => py(y.value))
const preStable = (n: number) => a / 2 ** n
const preUnstable = (n: number) => b * 2 ** n
const postStableAtSource = preStable(2) + sourceA
const postUnstableAtSource = preUnstable(2) + sourceB - sourceA * Math.cos(sourceX)
const postStable = (n: number) => postStableAtSource / 2 ** (n - 2)
const postUnstable = (n: number) => postUnstableAtSource * 2 ** (n - 2)
const sourceStable = (fraction: number) => preStable(2) + fraction * sourceA
const sourceUnstable = (fraction: number) => preUnstable(2) + fraction * (sourceB - sourceA * Math.cos(sourceX))
const stableNow = computed(() => Math.abs(stage.value === 0 ? preStable(time.value) : stage.value === 1 ? sourceStable(orangeProgress.value) : postStable(time.value)) * Math.hypot(1, Math.cos(x.value)))
const unstableNow = computed(() => Math.abs(stage.value === 0 ? preUnstable(time.value) : stage.value === 1 ? sourceUnstable(orangeProgress.value) : postUnstable(time.value)))
function vectorTip(stable: number, unstable: number) {
  return [px(x.value + stable), py(y.value + stable * Math.cos(x.value) + unstable)]
}
const preX = computed(() => vectorTip(preStable(time.value), preUnstable(time.value))[0])
const preY = computed(() => vectorTip(preStable(time.value), preUnstable(time.value))[1])
const postX = computed(() => vectorTip(postStable(time.value), postUnstable(time.value))[0])
const postY = computed(() => vectorTip(postStable(time.value), postUnstable(time.value))[1])
const sourceTipX = computed(() => px(x.value + sourceA))
const sourceTipY = computed(() => py(y.value + sourceB))
const lerp = (from: number, to: number, fraction: number) => from + (to - from) * fraction
const smooth = (value: number) => value * value * (3 - 2 * value)
const segment = (start: number, end: number) => smooth(Math.max(0, Math.min(1, (compose.value - start) / (end - start))))
const orangeProgress = computed(() => segment(0, .32))
const constructionProgress = computed(() => segment(.32, .68))
const greenProgress = computed(() => segment(.68, 1))

const chartX = (n: number) => 361 + 264 * n / 4
const chartY = (norm: number) => 374 - 72 * norm / 1.1
const preStableNorm = (n: number) => Math.abs(preStable(n)) * Math.hypot(1, Math.cos(x0 / 2 ** n))
const preUnstableNorm = (n: number) => Math.abs(preUnstable(n))
const postStableNorm = (n: number) => Math.abs(postStable(n)) * Math.hypot(1, Math.cos(x0 / 2 ** n))
const postUnstableNorm = (n: number) => Math.abs(postUnstable(n))
function pathFrom(samples: [number, number][]) {
  return samples.map(([n, value], i) => (i ? 'L ' : 'M ') + chartX(n).toFixed(1) + ' ' + chartY(value).toFixed(1)).join(' ')
}
function plotPath(pre: (n: number) => number, post: (n: number) => number) {
  const before = [0, 1, 2].filter(n => n < Math.min(time.value, 2))
  const samples: [number, number][] = before.map(n => [n, pre(n)])
  samples.push([Math.min(time.value, 2), pre(Math.min(time.value, 2))])
  if (stage.value >= 1) {
    const atSource = stage.value === 1
      ? (pre === preStableNorm
          ? Math.abs(sourceStable(orangeProgress.value)) * Math.hypot(1, Math.cos(sourceX))
          : Math.abs(sourceUnstable(orangeProgress.value)))
      : post(2)
    samples.push([2, atSource])
    if (stage.value === 2 && time.value > 2) {
      for (const n of [3, 4]) if (n < time.value) samples.push([n, post(n)])
      samples.push([time.value, post(time.value)])
    }
  }
  return pathFrom(samples)
}
const stablePath = computed(() => plotPath(preStableNorm, postStableNorm))
const unstablePath = computed(() => plotPath(preUnstableNorm, postUnstableNorm))
let frame = 0
let start = 0
const duration = 5000
function tick(now: number) {
  const elapsed = now - start
  if (stage.value === 1) {
    compose.value = Math.min(1, elapsed / 4800)
  } else {
    const phase = Math.min(1, elapsed / duration)
    const fraction = phase < .12 ? 0 : phase > .88 ? 1 : (phase - .12) / .76
    time.value = stage.value === 0 ? 2 * fraction : 2 + 2 * fraction
  }
  if (elapsed < (stage.value === 1 ? 4800 : duration)) frame = requestAnimationFrame(tick)
}
function setStage(next: number) {
  cancelAnimationFrame(frame)
  stage.value = Math.max(0, Math.min(2, next))
  time.value = stage.value === 0 ? 0 : 2
  compose.value = stage.value === 2 ? 1 : 0
  start = performance.now()
  frame = requestAnimationFrame(tick)
}
function replay() { setStage(stage.value) }
onMounted(() => { start = performance.now(); frame = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(frame))
</script>

<style scoped>
.source-figure { width: 100%; color: #34445e; }
svg { display: block; width: 100%; height: 330px; }
.axis, .chart-axis { stroke: #73849a; stroke-width: 1.25; }
.axis-label, .curve-label { fill: #56677f; font: 14px Georgia, serif; }
.curve-guide { fill: none; stroke: #b9c8d9; stroke-width: 1.6; }
.orbit-curve { fill: none; stroke: #202a35; stroke-width: 2.6; }
.start-point { fill: #5a6777; }
.moving-point { fill: #151a20; stroke: #fff; stroke-width: 1.7; }
.purple-vector { stroke: #7951a6; stroke-width: 2.6; }
.orange-vector { stroke: #c77725; stroke-width: 2.6; }
.green-vector { stroke: #25825d; stroke-width: 2.8; }
.parallelogram { stroke: #9aa7b5; stroke-width: 1.3; stroke-dasharray: 4 4; }
.purple-label, .orange-label, .green-label { font: 14px Georgia, serif; }
.purple-label { fill: #7951a6; }
.orange-label { fill: #ad621b; }
.green-label { fill: #217450; }
.chart-title { fill: #34445e; font: 14px Georgia, serif; }
.chart-label, .source-label { fill: #52627a; font: 11px Georgia, serif; }
.chart-grid { stroke: #e2e8ef; stroke-width: .8; }
.source-time { stroke: #202a35; stroke-width: 1.2; stroke-dasharray: 4 4; }
.stable-plot, .unstable-plot { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.stable-plot, .stable-legend { stroke: #216bb3; }
.unstable-plot, .unstable-legend { stroke: #b94c59; }
.stable-legend, .unstable-legend { stroke-width: 2.4; }
.stable-dot { fill: #216bb3; }
.unstable-dot { fill: #b94c59; }
.source-controls { display: flex; align-items: center; gap: .5rem; border-top: 1px solid #c9d3df; padding: .35rem 0; font-size: .79rem; }
.caption { flex: 1; }
.count { min-width: 2.2rem; text-align: center; }
button { color: #1e5b9d; border: 1px solid #a7b8cd; border-radius: 4px; padding: .05rem .5rem; font-size: 1.3rem; line-height: 1.1; background: #f4f7fb; cursor: pointer; }
button:disabled { opacity: .35; cursor: default; }
</style>
