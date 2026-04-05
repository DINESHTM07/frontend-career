import type { TrafficDataPoint } from '../types'

/*
  WHY colors live in the data (not the chart component):
  Each source has semantic meaning. Embedding colors here means adding a new
  source is one object — the chart component never needs to change.
*/

export const trafficData: TrafficDataPoint[] = [
  { name: 'Organic Search', value: 42150, color: '#4f46e5' },
  { name: 'Direct',         value: 28300, color: '#06b6d4' },
  { name: 'Social Media',   value: 18200, color: '#8b5cf6' },
  { name: 'Email',          value: 8050,  color: '#f59e0b' },
  { name: 'Paid Ads',       value: 4100,  color: '#ef4444' },
]

export const totalTraffic = trafficData.reduce((s, d) => s + d.value, 0) // 100,800
