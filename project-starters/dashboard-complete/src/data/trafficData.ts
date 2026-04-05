import type { TrafficDataPoint } from '../types'

/*
  trafficData.ts — Website traffic broken down by acquisition source.
  Used by TrafficPieChart.

  WHY embed colors in data (not in the chart component):
  Each source has a semantic color (organic = brand blue, paid = red for cost).
  Keeping colors here means adding a new source is one object — no chart edits needed.
  The chart just maps over the data and uses `entry.color`.
*/

export const trafficData: TrafficDataPoint[] = [
  { name: 'Organic Search', value: 42150, color: '#4f46e5' }, // brand indigo
  { name: 'Direct',         value: 28300, color: '#06b6d4' }, // cyan
  { name: 'Social Media',   value: 18200, color: '#8b5cf6' }, // purple
  { name: 'Email',          value: 8050,  color: '#f59e0b' }, // amber
  { name: 'Paid Ads',       value: 4100,  color: '#ef4444' }, // red
]

export const totalTraffic = trafficData.reduce((s, d) => s + d.value, 0) // 100,800
