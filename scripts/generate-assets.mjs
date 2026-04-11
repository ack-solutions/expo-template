import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'assets', 'images');

const COLORS = {
  indigo: '#1E3A8A',
  purple: '#2563EB',
  amber: '#F59E0B',
  ink: '#0F172A',
  lightBlue: '#E6F4FE',
  white: '#FFFFFF',
};

function svgIconMark({ fill = `url(#g)`, coin = COLORS.amber, stroke = 'none' } = {}) {
  // A simple calculator tile + rising chart + coin dot.
  // Designed to read well at small sizes.
  return `
    <g>
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${COLORS.indigo}"/>
          <stop offset="1" stop-color="${COLORS.purple}"/>
        </linearGradient>
      </defs>

      <!-- calculator body -->
      <rect x="250" y="230" rx="120" ry="120" width="524" height="564" fill="${fill}" stroke="${stroke}" stroke-width="0"/>

      <!-- top display -->
      <rect x="310" y="290" rx="56" ry="56" width="404" height="150" fill="rgba(255,255,255,0.18)"/>

      <!-- buttons (3x3) -->
      ${[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => {
          const x = 320 + c * 140;
          const y = 470 + r * 120;
          return `<rect x="${x}" y="${y}" rx="44" ry="44" width="112" height="92" fill="rgba(255,255,255,0.16)"/>`;
        }).join('\n')
      ).join('\n')}

      <!-- chart line -->
      <path d="M360 600 L455 540 L545 575 L650 470" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M360 600 L455 540 L545 575 L650 470" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"/>

      <!-- coin dot -->
      <circle cx="692" cy="446" r="46" fill="${coin}"/>
      <circle cx="692" cy="446" r="20" fill="rgba(255,255,255,0.35)"/>
    </g>
  `;
}

function svgAppIcon() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${COLORS.indigo}"/>
        <stop offset="1" stop-color="${COLORS.purple}"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="rgba(0,0,0,0.18)"/>
      </filter>
    </defs>

    <rect x="0" y="0" width="1024" height="1024" rx="240" ry="240" fill="url(#bg)"/>
    <circle cx="220" cy="210" r="210" fill="rgba(255,255,255,0.10)"/>
    <circle cx="900" cy="860" r="340" fill="rgba(0,0,0,0.08)"/>

    <g filter="url(#soft)">
      <g transform="translate(0,0)">
        ${svgIconMark({ fill: 'rgba(255,255,255,0.14)', coin: COLORS.amber })}
      </g>
    </g>
  </svg>`;
}

function svgSplashMark() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${COLORS.indigo}"/>
        <stop offset="1" stop-color="${COLORS.purple}"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="rgba(0,0,0,0.16)"/>
      </filter>
    </defs>
    <g filter="url(#soft)">
      ${svgIconMark({ fill: 'url(#g)', coin: COLORS.amber })}
    </g>
  </svg>`;
}

function svgAdaptiveForeground() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${COLORS.indigo}"/>
        <stop offset="1" stop-color="${COLORS.purple}"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="rgba(0,0,0,0.18)"/>
      </filter>
    </defs>
    <!-- keep generous margins for adaptive mask -->
    <g transform="translate(0,0)" filter="url(#soft)">
      ${svgIconMark({ fill: 'url(#g)', coin: COLORS.amber })}
    </g>
  </svg>`;
}

function svgAdaptiveBackground() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    <defs>
      <linearGradient id="b1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${COLORS.lightBlue}"/>
        <stop offset="1" stop-color="rgba(79,70,229,0.10)"/>
      </linearGradient>
      <radialGradient id="blob1" cx="35%" cy="30%" r="60%">
        <stop offset="0" stop-color="rgba(79,70,229,0.18)"/>
        <stop offset="1" stop-color="rgba(79,70,229,0.0)"/>
      </radialGradient>
      <radialGradient id="blob2" cx="75%" cy="80%" r="70%">
        <stop offset="0" stop-color="rgba(124,58,237,0.14)"/>
        <stop offset="1" stop-color="rgba(124,58,237,0.0)"/>
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#b1)"/>
    <circle cx="320" cy="280" r="420" fill="url(#blob1)"/>
    <circle cx="820" cy="820" r="520" fill="url(#blob2)"/>
    <path d="M0 760 C 220 660, 360 900, 560 800 C 760 700, 820 900, 1024 820 L 1024 1024 L 0 1024 Z"
      fill="rgba(15,23,42,0.04)"/>
  </svg>`;
}

function svgMonochrome() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
    ${svgIconMark({ fill: COLORS.ink, coin: COLORS.ink })}
  </svg>`;
}

function svgFavicon() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${COLORS.indigo}"/>
        <stop offset="1" stop-color="${COLORS.purple}"/>
      </linearGradient>
    </defs>
    <rect width="256" height="256" rx="60" ry="60" fill="url(#bg)"/>
    <!-- simple mark optimized for tiny sizes -->
    <rect x="56" y="54" rx="28" ry="28" width="144" height="148" fill="rgba(255,255,255,0.14)"/>
    <rect x="72" y="72" rx="18" ry="18" width="112" height="44" fill="rgba(255,255,255,0.18)"/>
    <path d="M80 158 L112 138 L146 150 L180 118" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="184" cy="114" r="16" fill="${COLORS.amber}"/>
  </svg>`;
}

async function writePngFromSvg({ svg, outPath, size, transparent = true }) {
  const input = Buffer.from(svg);
  const img = sharp(input, { density: 300 }).resize(size, size, { fit: 'cover' });
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const out = transparent ? img.png() : img.flatten({ background: COLORS.white }).png();
  await out.toFile(outPath);
}

async function main() {
  const targets = [
    { file: 'icon.png', svg: svgAppIcon(), size: 1024, transparent: false },
    { file: 'splash-icon.png', svg: svgSplashMark(), size: 1000, transparent: true },
    { file: 'android-icon-foreground.png', svg: svgAdaptiveForeground(), size: 1024, transparent: true },
    { file: 'android-icon-background.png', svg: svgAdaptiveBackground(), size: 1024, transparent: false },
    { file: 'android-icon-monochrome.png', svg: svgMonochrome(), size: 1024, transparent: true },
    { file: 'favicon.png', svg: svgFavicon(), size: 256, transparent: false },
  ];

  await Promise.all(
    targets.map(async (t) => {
      const outPath = path.join(OUT_DIR, t.file);
      await writePngFromSvg({ svg: t.svg, outPath, size: t.size, transparent: t.transparent });
    }),
  );

  // eslint-disable-next-line no-console
  console.log(`Generated ${targets.length} assets in ${OUT_DIR}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

