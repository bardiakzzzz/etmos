export const TUNNELS = [
  { id: 1,  name: 'Galleria Frejus',            road: 'A32', lat: 45.082, lng: 6.981,  cda: 4, len: 12.87, year: 1980, lanes: 2, lastScan: '17 Mar 2026', defects: 1801, trend: 'up',     cells: 12870 },
  { id: 2,  name: 'Galleria del Monte Bianco',   road: 'A5',  lat: 45.869, lng: 6.869,  cda: 3, len: 11.6,  year: 1965, lanes: 2, lastScan: '18 Mar 2026', defects: 940,  trend: 'up',     cells: 11600 },
  { id: 3,  name: 'Galleria Gran San Bernardo',  road: 'A5',  lat: 45.868, lng: 7.169,  cda: 2, len: 5.8,   year: 1964, lanes: 2, lastScan: '22 Feb 2026', defects: 310,  trend: 'stable', cells: 5800  },
  { id: 4,  name: 'Galleria dei Giovi',          road: 'A7',  lat: 44.583, lng: 8.916,  cda: 3, len: 3.2,   year: 1935, lanes: 2, lastScan: '10 Apr 2026', defects: 512,  trend: 'up',     cells: 3200  },
  { id: 5,  name: 'Galleria Apennino',           road: 'A1',  lat: 44.103, lng: 11.153, cda: 2, len: 18.5,  year: 1934, lanes: 2, lastScan: '01 Apr 2026', defects: 720,  trend: 'down',   cells: 18500 },
  { id: 6,  name: 'Galleria Serravalle',         road: 'A7',  lat: 44.722, lng: 8.858,  cda: 1, len: 4.9,   year: 1965, lanes: 2, lastScan: '15 Mar 2026', defects: 88,   trend: 'down',   cells: 4900  },
  { id: 7,  name: 'Galleria Gran Sasso',         road: 'A24', lat: 42.458, lng: 13.553, cda: 3, len: 10.2,  year: 1984, lanes: 2, lastScan: '28 Mar 2026', defects: 660,  trend: 'stable', cells: 10200 },
  { id: 8,  name: 'Galleria Capodichino',        road: 'A3',  lat: 40.883, lng: 14.286, cda: 1, len: 1.8,   year: 1994, lanes: 4, lastScan: '05 Apr 2026', defects: 42,   trend: 'down',   cells: 1800  },
  { id: 9,  name: 'Galleria Isarco',             road: 'A22', lat: 46.633, lng: 11.516, cda: 2, len: 7.6,   year: 1974, lanes: 2, lastScan: '20 Mar 2026', defects: 380,  trend: 'stable', cells: 7600  },
  { id: 10, name: 'Galleria del Traforo',        road: 'A2',  lat: 41.884, lng: 12.480, cda: 0, len: 2.3,   year: 2001, lanes: 2, lastScan: '08 Apr 2026', defects: 12,   trend: 'down',   cells: 2300  },
]

export const SEV_LABELS = ['Basso', 'Medio-Basso', 'Medio', 'Medio-Alto', 'Alto']
export const SEV_COLORS = ['#16a34a', '#65a30d', '#ca8a04', '#ea580c', '#dc2626']
export const SEV_BG     = ['#dcfce7', '#ecfccb', '#fef9c3', '#ffedd5', '#fee2e2']
export const SEV_TEXT   = ['#15803d', '#4d7c0f', '#a16207', '#c2410c', '#b91c1c']

export const MONTHS = ['Gen 24','Apr 24','Lug 24','Ott 24','Gen 25','Apr 25','Lug 25','Ott 25','Gen 26','Apr 26']

// ── Real scan session ──────────────────────────────────────────────────────────
// Session 20260317T201459Z — 70 frames from defects_on_the_wall scan
// status: 'clean' | 'minor' | 'major'
// coverage: % defect area (0 for clean)
const SESSION = '20260317T201459Z'
const BASE = `sessions/${SESSION}/defects_on_the_wall`

export const FRAMES = [
  { id: 'frame_000041', status: 'minor', coverage: 0.3  },
  { id: 'frame_000042', status: 'minor', coverage: 10.5 },
  { id: 'frame_000043', status: 'clean', coverage: 0    },
  { id: 'frame_000044', status: 'major', coverage: 53.3 },
  { id: 'frame_000045', status: 'minor', coverage: 12.6 },
  { id: 'frame_000046', status: 'minor', coverage: 11.0 },
  { id: 'frame_000047', status: 'minor', coverage: 12.1 },
  { id: 'frame_000048', status: 'major', coverage: 23.8 },
  { id: 'frame_000049', status: 'minor', coverage: 14.9 },
  { id: 'frame_000050', status: 'minor', coverage: 7.2  },
  { id: 'frame_000051', status: 'minor', coverage: 0.2  },
  { id: 'frame_000052', status: 'minor', coverage: 10.2 },
  { id: 'frame_000053', status: 'minor', coverage: 8.2  },
  { id: 'frame_000054', status: 'clean', coverage: 0    },
  { id: 'frame_000055', status: 'clean', coverage: 0    },
  { id: 'frame_000056', status: 'clean', coverage: 0    },
  { id: 'frame_000057', status: 'clean', coverage: 0    },
  { id: 'frame_000058', status: 'clean', coverage: 0    },
  { id: 'frame_000059', status: 'clean', coverage: 0    },
  { id: 'frame_000060', status: 'major', coverage: 52.1 },
  { id: 'frame_000061', status: 'clean', coverage: 0    },
  { id: 'frame_000062', status: 'major', coverage: 23.1 },
  { id: 'frame_000063', status: 'clean', coverage: 0    },
  { id: 'frame_000064', status: 'major', coverage: 29.5 },
  { id: 'frame_000065', status: 'clean', coverage: 0    },
  { id: 'frame_000066', status: 'clean', coverage: 0    },
  { id: 'frame_000067', status: 'clean', coverage: 0    },
  { id: 'frame_000068', status: 'clean', coverage: 0    },
  { id: 'frame_000069', status: 'minor', coverage: 19.7 },
  { id: 'frame_000070', status: 'minor', coverage: 14.4 },
  { id: 'frame_000071', status: 'clean', coverage: 0    },
  { id: 'frame_000072', status: 'clean', coverage: 0    },
  { id: 'frame_000073', status: 'clean', coverage: 0    },
  { id: 'frame_000074', status: 'clean', coverage: 0    },
  { id: 'frame_000075', status: 'clean', coverage: 0    },
  { id: 'frame_000076', status: 'clean', coverage: 0    },
  { id: 'frame_000077', status: 'clean', coverage: 0    },
  { id: 'frame_000078', status: 'clean', coverage: 0    },
  { id: 'frame_000079', status: 'clean', coverage: 0    },
  { id: 'frame_000080', status: 'clean', coverage: 0    },
  { id: 'frame_000081', status: 'clean', coverage: 0    },
  { id: 'frame_000082', status: 'clean', coverage: 0    },
  { id: 'frame_000083', status: 'clean', coverage: 0    },
  { id: 'frame_000084', status: 'clean', coverage: 0    },
  { id: 'frame_000085', status: 'minor', coverage: 0.8  },
  { id: 'frame_000086', status: 'minor', coverage: 7.4  },
  { id: 'frame_000087', status: 'minor', coverage: 6.3  },
  { id: 'frame_000088', status: 'minor', coverage: 5.3  },
  { id: 'frame_000089', status: 'minor', coverage: 3.2  },
  { id: 'frame_000090', status: 'clean', coverage: 0    },
  { id: 'frame_000091', status: 'clean', coverage: 0    },
  { id: 'frame_000092', status: 'minor', coverage: 0.8  },
  { id: 'frame_000093', status: 'minor', coverage: 1.9  },
  { id: 'frame_000094', status: 'clean', coverage: 0    },
  { id: 'frame_000095', status: 'clean', coverage: 0    },
  { id: 'frame_000096', status: 'clean', coverage: 0    },
  { id: 'frame_000097', status: 'clean', coverage: 0    },
  { id: 'frame_000098', status: 'clean', coverage: 0    },
  { id: 'frame_000099', status: 'clean', coverage: 0    },
  { id: 'frame_000100', status: 'clean', coverage: 0    },
  { id: 'frame_000101', status: 'clean', coverage: 0    },
  { id: 'frame_000102', status: 'clean', coverage: 0    },
  { id: 'frame_000103', status: 'clean', coverage: 0    },
  { id: 'frame_000104', status: 'clean', coverage: 0    },
  { id: 'frame_000105', status: 'clean', coverage: 0    },
  { id: 'frame_000106', status: 'clean', coverage: 0    },
  { id: 'frame_000107', status: 'minor', coverage: 10.0 },
  { id: 'frame_000108', status: 'clean', coverage: 0    },
  { id: 'frame_000109', status: 'clean', coverage: 0    },
  { id: 'frame_000110', status: 'clean', coverage: 0    },
]

// Map status → severity level (0-4)
export function frameSeverity(frame) {
  if (frame.status === 'clean') return 0
  if (frame.status === 'minor') return frame.coverage > 10 ? 2 : 1
  // major
  return frame.coverage > 40 ? 4 : 3
}

// Get the frame for a given heatmap cell (cycles through the 70 real frames)
export function cellFrame(col, row) {
  return FRAMES[(col + row * 8) % FRAMES.length]
}

// Image URLs for a given frame
export function frameOriginalUrl(frame) {
  return `${BASE}/original/${frame.id}.jpg`
}
export function frameOverlayUrl(frame) {
  return `${BASE}/overlay/${frame.id}.jpg`
}

// First frame with a major defect — used as tunnel hero photo
export const HERO_FRAME = FRAMES.find(f => f.status === 'major')

export function cellSevAtTime(tunnel, row, col, seed, tIdx) {
  const base = Math.abs(Math.sin((tunnel.id + seed) * 1.3 + (row + seed * 0.5) * 7.1 + col * 0.83))
  const timeShift = (tIdx / 9) * 0.28
  return Math.min(4, Math.floor((base + timeShift) * 5))
}
