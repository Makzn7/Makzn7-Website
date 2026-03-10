<!-- HeroGrid — parametric perspective grid -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  class:       { type: String,  default: "" },
  cols:        { type: Number,  default: 22 },       // vertical divisions in center rect
  rows:        { type: Number,  default: 17 },       // horizontal divisions in center rect
  wingSteps:   { type: Number,  default: 10 },       // internal lines per wing
  aspectRatio: { type: String,  default: "xMidYMid meet" }, // or 'none' to stretch
});

// ── Fixed coordinate system (matches original design) ─────
const RL = 113.666, RR = 723.972, RT = 90.394, RB = 575.747;
const RW = RR - RL, RH = RB - RT;
const OX = 127.839, OY = 101.658;
const FLX = RL - OX;   // far-left  x  = -14.173
const FRX = RR + OX;   // far-right x  = 851.811
const FTY = RT - OY;   // far-top   y  = -11.264
const FBY = RB + OY;   // far-bot   y  = 677.405

function lerp(a, b, t) { return a + (b - a) * t; }

// ── Center rectangle grid ─────────────────────────────────
const center = computed(() => {
  let d = "";
  for (let i = 0; i <= props.cols; i++) {
    const x = lerp(RL, RR, i / props.cols);
    d += `M${x},${RT}V${RB}`;
  }
  for (let j = 0; j <= props.rows; j++) {
    const y = lerp(RT, RB, j / props.rows);
    d += `M${RL},${y}H${RR}`;
  }
  return d;
});

// ── Left wing ─────────────────────────────────────────────
const leftWing = computed(() => {
  let d = "";
  // fan lines: each row extends left to the far-left edge
  for (let j = 0; j <= props.rows; j++) {
    const t  = j / props.rows;
    const ry = lerp(RT, RB, t);
    const fy = lerp(FTY, FBY, t);
    d += `M${RL},${ry}L${FLX},${fy}`;
  }
  // depth lines: vertical lines inside the left trapezoid
  for (let k = 1; k <= props.wingSteps; k++) {
    const t    = k / (props.wingSteps + 1);
    const x    = lerp(FLX, RL, t);
    const topY = lerp(FTY, RT, t);
    const botY = lerp(FBY, RB, t);
    d += `M${x},${topY}V${botY}`;
  }
  return d;
});

// ── Right wing ────────────────────────────────────────────
const rightWing = computed(() => {
  let d = "";
  for (let j = 0; j <= props.rows; j++) {
    const t  = j / props.rows;
    const ry = lerp(RT, RB, t);
    const fy = lerp(FTY, FBY, t);
    d += `M${RR},${ry}L${FRX},${fy}`;
  }
  for (let k = 1; k <= props.wingSteps; k++) {
    const t    = k / (props.wingSteps + 1);
    const x    = lerp(RR, FRX, t);
    const topY = lerp(RT, FTY, t);
    const botY = lerp(RB, FBY, t);
    d += `M${x},${topY}V${botY}`;
  }
  return d;
});

// ── Top wing ──────────────────────────────────────────────
const topWing = computed(() => {
  let d = "";
  // fan lines: each col extends up to the far-top edge
  for (let i = 0; i <= props.cols; i++) {
    const t  = i / props.cols;
    const rx = lerp(RL, RR, t);
    const fx = lerp(FLX, FRX, t);
    d += `M${rx},${RT}L${fx},${FTY}`;
  }
  // depth lines: horizontal lines inside the top trapezoid
  for (let k = 1; k <= props.wingSteps; k++) {
    const t      = k / (props.wingSteps + 1);
    const y      = lerp(FTY, RT, t);
    const leftX  = lerp(FLX, RL, t);
    const rightX = lerp(FRX, RR, t);
    d += `M${leftX},${y}H${rightX}`;
  }
  return d;
});

// ── Bottom wing ───────────────────────────────────────────
const bottomWing = computed(() => {
  let d = "";
  for (let i = 0; i <= props.cols; i++) {
    const t  = i / props.cols;
    const rx = lerp(RL, RR, t);
    const fx = lerp(FLX, FRX, t);
    d += `M${rx},${RB}L${fx},${FBY}`;
  }
  for (let k = 1; k <= props.wingSteps; k++) {
    const t      = k / (props.wingSteps + 1);
    const y      = lerp(RB, FBY, t);
    const leftX  = lerp(RL, FLX, t);
    const rightX = lerp(RR, FRX, t);
    d += `M${leftX},${y}H${rightX}`;
  }
  return d;
});

const allPaths = computed(() =>
  center.value +
  leftWing.value + rightWing.value +
  topWing.value  + bottomWing.value
);

// ViewBox: full extent + small margin
const viewBox = `${FLX - 20} ${FTY - 20} ${FRX - FLX + 40} ${FBY - FTY + 40}`;
</script>

<template>
  <svg
    :class="['w-full', $props.class]"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
    :preserveAspectRatio="aspectRatio"
  >
    <!-- Border rectangle -->
    <rect
      :x="113.666" :y="90.394"
      :width="610.306" :height="485.353"
      fill="none"
      stroke="#54eb62"
      stroke-width=".5"
    />
    <!-- All grid + wing lines -->
    <path
      :d="allPaths"
      fill="none"
      stroke="#54eb62"
      stroke-width=".5"
    />
  </svg>
</template>
