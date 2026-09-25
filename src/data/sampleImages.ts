export interface SampleLeaf {
  id: string;
  name: string;
  plant: string;
  condition: string;
  description: string;
  expectedConfidence: number;
  dataUrl: string;
}

// Generate high quality SVG data URLs depicting realistic agricultural leaves with spots
function createLeafSvg(
  baseColor: string,
  spotColor: string,
  leafType: 'tomato' | 'corn' | 'apple' | 'healthy',
  spots: Array<{ cx: number; cy: number; rx: number; ry: number; angle?: number; opacity?: number }>
): string {
  const spotElements = spots
    .map(
      (s) =>
        `<ellipse cx="${s.cx}" cy="${s.cy}" rx="${s.rx}" ry="${s.ry}" fill="${spotColor}" opacity="${
          s.opacity ?? 0.85
        }" transform="rotate(${s.angle ?? 0} ${s.cx} ${s.cy})"/>`
    )
    .join('');

  let path = '';
  let veins = '';

  if (leafType === 'tomato') {
    // Serrated lobed tomato leaf
    path = `M 150 40 
            C 180 80, 220 100, 260 110
            C 230 130, 240 160, 270 190
            C 220 200, 200 240, 210 270
            C 180 260, 160 300, 150 350
            C 140 300, 120 260, 90 270
            C 100 240, 80 200, 30 190
            C 60 160, 70 130, 40 110
            C 80 100, 120 80, 150 40 Z`;
    veins = `
      <path d="M 150 40 L 150 360" stroke="#166534" stroke-width="4" stroke-linecap="round"/>
      <path d="M 150 110 Q 180 105 230 115" stroke="#166534" stroke-width="2.5"/>
      <path d="M 150 110 Q 120 105 70 115" stroke="#166534" stroke-width="2.5"/>
      <path d="M 150 180 Q 190 175 240 195" stroke="#166534" stroke-width="2.5"/>
      <path d="M 150 180 Q 110 175 60 195" stroke="#166534" stroke-width="2.5"/>
      <path d="M 150 250 Q 180 245 200 265" stroke="#166534" stroke-width="2"/>
      <path d="M 150 250 Q 120 245 100 265" stroke="#166534" stroke-width="2"/>
    `;
  } else if (leafType === 'corn') {
    // Elongated maize leaf
    path = `M 150 30
            C 190 100, 210 200, 210 320
            C 180 340, 150 360, 150 370
            C 150 360, 120 340, 90 320
            C 90 200, 110 100, 150 30 Z`;
    veins = `
      <path d="M 150 30 L 150 370" stroke="#15803d" stroke-width="4.5"/>
      <path d="M 130 60 L 130 340" stroke="#22c55e" stroke-width="1.5" opacity="0.6"/>
      <path d="M 170 60 L 170 340" stroke="#22c55e" stroke-width="1.5" opacity="0.6"/>
      <path d="M 110 100 L 110 320" stroke="#22c55e" stroke-width="1" opacity="0.5"/>
      <path d="M 190 100 L 190 320" stroke="#22c55e" stroke-width="1" opacity="0.5"/>
    `;
  } else {
    // Broad ovate leaf (Apple / Potato / General)
    path = `M 150 35
            C 210 70, 260 140, 250 230
            C 240 290, 190 330, 150 360
            C 110 330, 60 290, 50 230
            C 40 140, 90 70, 150 35 Z`;
    veins = `
      <path d="M 150 35 L 150 375" stroke="#166534" stroke-width="4"/>
      <path d="M 150 90 C 180 80, 210 100, 230 130" stroke="#166534" stroke-width="2"/>
      <path d="M 150 90 C 120 80, 90 100, 70 130" stroke="#166534" stroke-width="2"/>
      <path d="M 150 160 C 190 150, 220 180, 245 220" stroke="#166534" stroke-width="2"/>
      <path d="M 150 160 C 110 150, 80 180, 55 220" stroke="#166534" stroke-width="2"/>
      <path d="M 150 230 C 180 225, 210 250, 230 280" stroke="#166534" stroke-width="2"/>
      <path d="M 150 230 C 120 225, 90 250, 70 280" stroke="#166534" stroke-width="2"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </radialGradient>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${baseColor}"/>
          <stop offset="100%" stop-color="${baseColor}" stop-opacity="0.85"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="300" height="400" fill="url(#bg)"/>
      <!-- Grid overlay simulating lab capture -->
      <path d="M 0 100 L 300 100 M 0 200 L 300 200 M 0 300 L 300 300 M 100 0 L 100 400 M 200 0 L 200 400" stroke="#cbd5e1" stroke-width="0.5" opacity="0.4"/>
      <!-- Petiole/Stem -->
      <path d="M 150 350 Q 152 385 155 398" stroke="#4ade80" stroke-width="6" stroke-linecap="round"/>
      <!-- Leaf Blade -->
      <path d="${path}" fill="url(#leafGrad)" stroke="#15803d" stroke-width="2" filter="url(#shadow)"/>
      ${veins}
      <!-- Disease spots or texture -->
      ${spotElements}
      <!-- Lab photo scale indicator -->
      <text x="12" y="388" font-family="monospace" font-size="9" fill="#64748b">PLANT-VILLAGE LAB SPECIMEN</text>
      <rect x="230" y="375" width="55" height="12" fill="#334155" rx="2"/>
      <text x="238" y="384" font-family="monospace" font-size="8" fill="#f8fafc">1 cm</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-tomato-late-blight',
    name: 'Tomato Leaf - Late Blight',
    plant: 'Tomato',
    condition: 'Tomato Late Blight',
    description: 'Irregular dark necrotic lesions with water-soaked pale green margins.',
    expectedConfidence: 94.7,
    dataUrl: createLeafSvg(
      '#4ade80',
      '#451a03',
      'tomato',
      [
        { cx: 180, cy: 140, rx: 28, ry: 20, angle: 25, opacity: 0.88 },
        { cx: 120, cy: 190, rx: 34, ry: 24, angle: -15, opacity: 0.92 },
        { cx: 195, cy: 220, rx: 22, ry: 16, angle: 10, opacity: 0.85 },
        { cx: 140, cy: 260, rx: 18, ry: 14, angle: 45, opacity: 0.8 },
        { cx: 90, cy: 130, rx: 16, ry: 12, angle: -30, opacity: 0.75 }
      ]
    )
  },
  {
    id: 'sample-apple-scab',
    name: 'Apple Leaf - Apple Scab',
    plant: 'Apple',
    condition: 'Apple Scab',
    description: 'Distinct olive-green to dark velvety fungal lesions on the upper leaf surface.',
    expectedConfidence: 96.2,
    dataUrl: createLeafSvg(
      '#86efac',
      '#1c1917',
      'apple',
      [
        { cx: 130, cy: 120, rx: 16, ry: 14, angle: 12, opacity: 0.85 },
        { cx: 180, cy: 160, rx: 20, ry: 18, angle: -20, opacity: 0.9 },
        { cx: 120, cy: 230, rx: 24, ry: 20, angle: 35, opacity: 0.88 },
        { cx: 170, cy: 260, rx: 15, ry: 12, angle: -10, opacity: 0.82 }
      ]
    )
  },
  {
    id: 'sample-corn-blight',
    name: 'Corn Leaf - Northern Blight',
    plant: 'Corn (Maize)',
    condition: 'Corn Northern Leaf Blight',
    description: 'Long elliptical cigar-shaped lesions running parallel to the parallel veins.',
    expectedConfidence: 92.4,
    dataUrl: createLeafSvg(
      '#a3e635',
      '#78350f',
      'corn',
      [
        { cx: 145, cy: 140, rx: 14, ry: 48, angle: 4, opacity: 0.88 },
        { cx: 160, cy: 240, rx: 12, ry: 55, angle: -2, opacity: 0.9 },
        { cx: 130, cy: 290, rx: 9, ry: 35, angle: 3, opacity: 0.82 }
      ]
    )
  },
  {
    id: 'sample-healthy-tomato',
    name: 'Tomato Leaf - Healthy',
    plant: 'Tomato',
    condition: 'Healthy',
    description: 'Uniform vibrant green canopy without pathogen sporulation or chlorosis.',
    expectedConfidence: 98.8,
    dataUrl: createLeafSvg(
      '#22c55e',
      '#15803d',
      'tomato',
      [
        { cx: 150, cy: 150, rx: 2, ry: 2, opacity: 0.05 }
      ]
    )
  }
];

export async function sampleLeafToFile(sample: SampleLeaf): Promise<File> {
  const res = await fetch(sample.dataUrl);
  const blob = await res.blob();
  const filename = `${sample.id}.svg`;
  return new File([blob], filename, { type: 'image/svg+xml' });
}
