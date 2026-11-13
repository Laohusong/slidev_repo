<template>
  <div class="cavity-diagram">
    <svg viewBox="0 0 330 225" role="img" :aria-label="descriptions[mode]">
      <defs>
        <marker :id="blueMarker" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#256eb3" />
        </marker>
        <marker :id="orangeMarker" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="#c47b2c" />
        </marker>
      </defs>
      <line x1="12" y1="194" x2="318" y2="194" class="baseline" />

      <g v-if="mode === 'remove'">
        <rect x="135" y="30" width="174" height="146" rx="4" class="reservoir-boundary" />
        <text x="222" y="50" text-anchor="middle" class="group-label">reservoir · sites 1,…,N</text>
        <line v-for="(edge, i) in reservoirEdges" :key="i"
          :x1="nodes[edge[0]].x" :y1="nodes[edge[0]].y"
          :x2="nodes[edge[1]].x" :y2="nodes[edge[1]].y" class="reservoir-edge" />
        <line v-for="(index, i) in [0, 2, 4]" :key="'cut-' + i"
          :x1="siteX" y1="111" :x2="nodes[index].x" :y2="nodes[index].y"
          class="detaching-edge" :style="{ opacity: 1 - removeProgress }" />
        <circle v-for="(node, i) in nodes" :key="'r-' + i" :cx="node.x" :cy="node.y" r="10" class="reservoir-node" />
        <line x1="119" y1="64" x2="119" y2="166" class="cut-line" :style="{ opacity: removeProgress }" />
        <circle :cx="siteX" cy="111" r="17" class="site-zero" />
        <text :x="siteX" y="116" text-anchor="middle" class="site-number">0</text>
        <text x="50" y="164" text-anchor="middle" class="stage-note" :style="{ opacity: removeProgress }">isolated</text>
      </g>

      <g v-else-if="mode === 'feedback'">
        <rect x="145" y="30" width="173" height="146" rx="4" class="reservoir-boundary" />
        <text x="231" y="50" text-anchor="middle" class="group-label">reservoir</text>
        <line v-for="(edge, i) in reservoirEdges" :key="i"
          :x1="feedbackNodes[edge[0]].x" :y1="feedbackNodes[edge[0]].y"
          :x2="feedbackNodes[edge[1]].x" :y2="feedbackNodes[edge[1]].y" class="reservoir-edge" />
        <circle v-for="(node, i) in feedbackNodes" :key="'f-' + i" :cx="node.x" :cy="node.y" r="10" class="reservoir-node" />
        <circle cx="57" cy="111" r="17" class="site-zero" />
        <text x="57" y="116" text-anchor="middle" class="site-number">0</text>
        <line x1="74" y1="99" :x2="lerp(74, 178, outward)" :y2="lerp(99, 82, outward)"
          class="outward-edge" :marker-end="outward > .35 ? blueMarkerUrl : undefined" />
        <line x1="74" y1="121" :x2="lerp(74, 181, outward)" :y2="lerp(121, 144, outward)"
          class="outward-edge" :marker-end="outward > .35 ? blueMarkerUrl : undefined" />
        <circle v-if="progress > .35 && progress < .69" cx="226" cy="111" :r="12 + 15 * reservoirPulse" class="response-pulse" :style="{ opacity: .55 * (1 - reservoirPulse) }" />
        <line v-if="backward > .02" x1="279" y1="81" :x2="lerp(279, 74, backward)" :y2="lerp(81, 91, backward)"
          class="return-edge" :marker-end="backward > .4 ? orangeMarkerUrl : undefined" />
        <line v-if="backward > .02" x1="278" y1="145" :x2="lerp(278, 74, backward)" :y2="lerp(145, 131, backward)"
          class="return-edge" :marker-end="backward > .4 ? orangeMarkerUrl : undefined" />
        <text x="111" y="71" text-anchor="middle" class="flow-label">weak input</text>
        <text x="102" y="159" text-anchor="middle" class="return-label" :style="{ opacity: backward }">feedback</text>
      </g>

      <g v-else>
        <circle cx="69" cy="111" r="22" class="site-zero" />
        <text x="69" y="117" text-anchor="middle" class="site-number">0</text>
        <rect x="185" y="65" width="123" height="91" rx="4" class="field-box" />
        <text x="246" y="103" text-anchor="middle" class="field-label">Gaussian field</text>
        <text x="246" y="125" text-anchor="middle" class="field-subtitle">+ response kernels</text>
        <line x1="91" y1="91" :x2="lerp(91, 185, closureOut)" :y2="lerp(91, 87, closureOut)"
          class="outward-edge" :marker-end="closureOut > .4 ? blueMarkerUrl : undefined" />
        <line v-if="closureBack > .02" x1="185" y1="137" :x2="lerp(185, 91, closureBack)" :y2="lerp(137, 132, closureBack)"
          class="return-edge" :marker-end="closureBack > .4 ? orangeMarkerUrl : undefined" />
        <text x="139" y="70" text-anchor="middle" class="flow-label">site statistics</text>
        <text x="142" y="165" text-anchor="middle" class="return-label" :style="{ opacity: closureBack }">effective input</text>
        <circle cx="69" cy="111" :r="26 + 5 * closureBack" class="closure-ring" :style="{ opacity: closureBack }" />
        <text x="162" y="207" text-anchor="middle" class="stage-note" :style="{ opacity: closureBack }">self-consistent single site</text>
      </g>
    </svg>
    <div class="diagram-controls">
      <span>{{ phaseLabels[mode] }}</span>
      <button type="button" @click.stop="replay" :aria-label="'Replay ' + mode + ' animation'">↻ Replay</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

type Phase = 'remove' | 'feedback' | 'closure'
const props = withDefaults(defineProps<{ mode: Phase; delay?: number }>(), { delay: 0 })
const descriptions: Record<Phase, string> = {
  remove: 'Neuron zero moves away while the reservoir remains intact',
  feedback: 'Neuron zero perturbs the reservoir and receives its linear response',
  closure: 'Single-neuron statistics and an effective Gaussian field close self-consistently',
}
const phaseLabels: Record<Phase, string> = {
  remove: 'Remove site 0',
  feedback: 'Reconnect and measure feedback',
  closure: 'Close the single-site theory',
}
const nodes = [
  { x: 170, y: 76 }, { x: 217, y: 69 }, { x: 276, y: 80 },
  { x: 167, y: 135 }, { x: 226, y: 143 }, { x: 282, y: 134 },
]
const feedbackNodes = nodes.map(node => ({ x: node.x + 8, y: node.y }))
const reservoirEdges: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [0, 4], [1, 5],
]
const progress = ref(0)
const blueMarker = 'cavity-blue-' + props.mode
const orangeMarker = 'cavity-orange-' + props.mode
const blueMarkerUrl = 'url(#' + blueMarker + ')'
const orangeMarkerUrl = 'url(#' + orangeMarker + ')'
const lerp = (from: number, to: number, fraction: number) => from + (to - from) * fraction
const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => value * value * (3 - 2 * value)
const segment = (start: number, end: number) => smooth(clamp01((progress.value - start) / (end - start)))
const removeProgress = computed(() => segment(.08, .92))
const siteX = computed(() => lerp(106, 47, removeProgress.value))
const outward = computed(() => segment(.08, .44))
const reservoirPulse = computed(() => segment(.36, .68))
const backward = computed(() => segment(.55, .96))
const closureOut = computed(() => segment(.08, .48))
const closureBack = computed(() => segment(.50, .96))
let frame = 0
let start = 0
const duration = 3200
function tick(now: number) {
  progress.value = clamp01((now - start) / duration)
  if (progress.value < 1) frame = requestAnimationFrame(tick)
}
function replay() {
  cancelAnimationFrame(frame)
  progress.value = 0
  start = performance.now()
  frame = requestAnimationFrame(tick)
}
onMounted(() => { start = performance.now() + props.delay; frame = requestAnimationFrame(tick) })
onUnmounted(() => cancelAnimationFrame(frame))
</script>

<style scoped>
.cavity-diagram { width: 100%; color: #34445e; }
svg { display: block; width: 100%; height: 210px; }
.baseline { stroke: #d9e2eb; stroke-width: 1; }
.reservoir-boundary, .field-box { fill: #f6f9fc; stroke: #9bb2ce; stroke-width: 1.3; }
.reservoir-edge { stroke: #bac9d9; stroke-width: 1.3; }
.detaching-edge { stroke: #6c92ba; stroke-width: 1.8; }
.reservoir-node { fill: #5f8dbd; stroke: white; stroke-width: 1.3; }
.site-zero { fill: #285f9f; stroke: white; stroke-width: 1.5; }
.site-number { fill: white; font: bold 17px Georgia, serif; }
.cut-line { stroke: #7d91aa; stroke-width: 1.5; stroke-dasharray: 5 4; }
.outward-edge { stroke: #256eb3; stroke-width: 2.2; }
.return-edge { stroke: #c47b2c; stroke-width: 2.2; }
.response-pulse, .closure-ring { fill: none; stroke: #6f9dcb; stroke-width: 1.8; }
.group-label, .field-label { fill: #34445e; font: 14px Georgia, serif; }
.field-subtitle { fill: #5e728d; font: 11px Georgia, serif; }
.flow-label, .stage-note { fill: #53708f; font: 12px Georgia, serif; }
.return-label { fill: #ad6b25; font: 12px Georgia, serif; }
.diagram-controls { display: flex; align-items: center; justify-content: space-between; gap: .35rem; border-top: 1px solid #d0dae5; padding-top: .24rem; font-size: .7rem; }
.diagram-controls button { color: #1e5b9d; border: 1px solid #a7b8cd; border-radius: 4px; padding: .08rem .32rem; font-size: .67rem; line-height: 1.1; background: #f4f7fb; cursor: pointer; white-space: nowrap; }
</style>
