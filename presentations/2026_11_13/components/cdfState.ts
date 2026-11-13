import { computed, ref } from 'vue'

// Ordered illustrative exponents; these are not numerical results from the paper.
export const exponents = [0.82, 0.68, 0.54, 0.38, 0.27, 0.12, -0.05, -0.18, -0.32, -0.48, -0.66, -0.81]
export const threshold = ref(-0.9)
export const belowCount = computed(() => exponents.filter(value => value < threshold.value).length)
