const fs = require('fs');
const sharp = require('sharp');

const svgIcon = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Strong, high-contrast drop shadow to ensure separation on any background -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="30" flood-opacity="0.25" />
    </filter>
    <filter id="lightShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="20" flood-opacity="0.3" />
    </filter>
  </defs>

  <g transform="translate(10, 0)">  
    <!-- Main Calculator Body - High contrast dark blue instead of white -->
    <rect x="250" y="160" width="480" height="700" rx="70" fill="#1E3A8A" filter="url(#shadow)" />
    
    <!-- Screen Viewport - Vivid Bright Blue/Cyan -->
    <rect x="310" y="230" width="360" height="150" rx="40" fill="#E0F2FE" />
    
    <!-- Screen Text/Content -->
    <text x="630" y="335" font-family="Arial, sans-serif" font-weight="900" font-size="70" fill="#1E3A8A" text-anchor="end">24,500</text>
    <circle cx="360" cy="270" r="12" fill="#3B82F6" opacity="0.8" />
    <circle cx="400" cy="270" r="12" fill="#3B82F6" opacity="0.8" />

    <!-- Buttons - Pure White for maximum separation against the dark calculator body -->
    <!-- Row 1 -->
    <rect x="310" y="450" width="90" height="70" rx="25" fill="#FFFFFF" />
    <rect x="445" y="450" width="90" height="70" rx="25" fill="#FFFFFF" />
    <rect x="580" y="450" width="90" height="70" rx="25" fill="#FFFFFF" />
    
    <!-- Row 2 -->
    <rect x="310" y="560" width="90" height="70" rx="25" fill="#FFFFFF" />
    <rect x="445" y="560" width="90" height="70" rx="25" fill="#FFFFFF" />
    <rect x="580" y="560" width="90" height="70" rx="25" fill="#FFFFFF" />
    
    <!-- Row 3 -->
    <rect x="310" y="670" width="90" height="70" rx="25" fill="#FFFFFF" />
    <rect x="445" y="670" width="90" height="70" rx="25" fill="#FFFFFF" />
    <!-- Action Button inside calculator -->
    <rect x="580" y="670" width="90" height="70" rx="25" fill="#3B82F6" />

    <!-- Overlapping Pie Chart Donut - Vibrant Colors -->
    <g filter="url(#lightShadow)" transform="translate(700, 720)">
      <!-- Base Pie (Teal) -->
      <circle cx="0" cy="0" r="160" fill="#06B6D4" />
      <!-- Pie slice (Vivid Orange) -->
      <path d="M 0 0 L 0 -160 A 160 160 0 0 1 160 0 Z" fill="#F97316" />
      <!-- Inner hole for donut so it lets background pop through -->
      <circle cx="0" cy="0" r="60" fill="#1E3A8A" />
      <circle cx="0" cy="0" r="45" fill="#FFFFFF" />
    </g>
  </g>
</svg>
`;

const SIZE = 1024;
// Padding is important for Android adaptive icon masks (OEMs can be aggressive).
// `inset` is per-side padding as a fraction of SIZE. Example: 0.12 => 12% padding each side.
const INSET_ADAPTIVE_FOREGROUND = 0.14;
const INSET_APP_ICON = 0.1;
const INSET_SPLASH = 0.1;

async function renderPaddedPng({
  svg,
  size,
  inset,
  background,
  outputPath,
}) {
  const innerSize = Math.max(1, Math.round(size * (1 - inset * 2)));

  const inner = await sharp(Buffer.from(svg))
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? {
 r: 0,
g: 0,
b: 0,
alpha: 0 
},
    },
  });

  await base
    .composite([
{
 input: inner,
gravity: 'center' 
}
])
    .png()
    .toFile(outputPath);
}

async function generate() {
  // 1. Transparent foreground icon for Android Adaptive Icons
  await renderPaddedPng({
    svg: svgIcon,
    size: SIZE,
    inset: INSET_ADAPTIVE_FOREGROUND,
    outputPath: './assets/images/android-icon-foreground.png',
  });

  console.log('✓ Created android-icon-foreground.png (Transparent)');

  // 2. Transparent splash screen icon
  await renderPaddedPng({
    svg: svgIcon,
    size: SIZE,
    inset: INSET_SPLASH,
    outputPath: './assets/images/splash-icon.png',
  });

  console.log('✓ Created splash-icon.png (Transparent)');

  // 3. Opaque iOS/General App Icon (with pure #E6F4FE background)
  await renderPaddedPng({
    svg: svgIcon,
    size: SIZE,
    inset: INSET_APP_ICON,
    background: '#E6F4FE',
    outputPath: './assets/images/icon.png',
  });

  console.log('✓ Created icon.png (Opaque)');

  // 4. Favicon (Web) - Transparent and sized
  await sharp(Buffer.from(svgIcon))
    .resize(256, 256)
    .png()
    .toFile('./assets/images/favicon.png');

  console.log('✓ Created favicon.png (Transparent)');
}

generate().catch(console.error);
