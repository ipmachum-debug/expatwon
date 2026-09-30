/**
 * Builds the figures for the foreign-registration guide.
 *
 * Sources live outside the repo (/tmp/frc): seven HiKorea captures and the two
 * Ministry of Justice forms rendered from PDF at 200dpi. Nothing here needs
 * masking — every HiKorea field in frame is empty, and the passport and visa
 * images on those pages are the portal's own specimens, stamped SPECIMEN and
 * 견본 and made out to 홍길동, Korea's John Doe.
 *
 * Two things this script does that the earlier batches did not.
 *
 * 1. It crops at capture time rather than afterwards. The margin trim that
 *    crop-figures.mjs had to apply to 32 already-published files is a `frame`
 *    here, so these land already trimmed.
 *
 * 2. It ANNOTATES the two blank forms. A blank government form is a poor
 *    instruction: every box is equally empty, so the reader cannot tell which
 *    of the ten checkboxes is theirs or which rows a first-time applicant even
 *    fills in. HiKorea itself solves this the same way — its passport and visa
 *    specimens carry red ①②③ markers against the fields you must copy — so the
 *    markers below follow that convention rather than inventing one.
 *
 *    The markers sit in a gutter added BESIDE the form, never on top of it.
 *    Nothing in the document is covered, moved or overwritten, and no sample
 *    values are painted into the boxes: a filled-in form reproduced on a
 *    website is a template for someone to copy wrongly, and an image of a
 *    government form with writing on it is exactly the thing the K-ETA guide
 *    tells readers never to produce. What each number means is prose, in the
 *    caption under the figure, where it can be read, corrected and translated.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = '/tmp/frc/';
const OUT = 'src/assets/entry/';
mkdirSync(OUT, { recursive: true });

/** A numbered marker in the style HiKorea uses on its own specimen images. */
const marker = (n, size) =>
  Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 2}" fill="#c1121f"/>` +
      `<text x="50%" y="50%" dy="0.35em" text-anchor="middle" fill="#fff" ` +
      `font-family="DejaVu Sans, Arial, sans-serif" font-size="${size * 0.62}" ` +
      `font-weight="bold">${n}</text></svg>`,
  );

const JOBS = [
  // ── HiKorea ──────────────────────────────────────────────────────────────
  // The home page carousel is a third of the capture and none of it is the
  // service panel, so the frame starts below it.
  { src: 'hik-085150.png', out: 'frc-1-hikorea-home.png', frame: [0, 0.45, 1, 0.705] },
  { src: 'hik-085550.png', out: 'frc-2-how-to-use.png', frame: [0.24, 0, 0.95, 0.42] },
  { src: 'hik-085629.png', out: 'frc-3-is-it-mandatory.png', frame: [0.064, 0, 0.99, 1] },
  { src: 'hik-085507.png', out: 'frc-4-important-note.png', frame: [0.075, 0, 0.966, 1] },
  { src: 'hik-085659.png', out: 'frc-5-verify-registration-no.png', frame: [0.255, 0, 0.98, 1] },
  { src: 'hik-085814.png', out: 'frc-6-verify-passport-no.png', frame: [0.001, 0, 0.943, 1] },
  { src: 'hik-085754.png', out: 'frc-7-verify-visa-number.png', frame: [0.018, 0, 0.969, 1] },

  // ── The two forms, with markers in a left gutter ─────────────────────────
  // y values are fractions of the page height, read off the rendered page.
  {
    src: 'iaf-p1.png',
    out: 'frc-8-application-form.png',
    frame: [0.06, 0.04, 0.96, 0.78],
    markers: [
      // Left-hand rows only. The photo box is on the right of the form and a
      // marker in the left gutter at its height would point at the row beside
      // it instead — the photo rule is in the caption, and printed in English
      // on the form itself.
      [1, 0.195], // FOREIGN RESIDENT REGISTRATION — the first of ten boxes
      [2, 0.435], // Name in full, exactly as the passport spells it
      [3, 0.518], // Foreign Resident Registration No. — blank on a first application
      [4, 0.552], // Passport number, issue date, expiry date
      [5, 0.588], // Address in Korea — the one the proof of residence must match
      [6, 0.878], // Date of application and signature
    ],
  },
  {
    src: 'cra-p1.png',
    out: 'frc-9-accommodation-form.png',
    frame: [0.06, 0.03, 0.96, 1],
    markers: [
      [1, 0.088], // Section 1 — the foreigner receiving the accommodation
      [2, 0.254], // Section 2 — whoever provides it
      [3, 0.381], // Relationship: Employer, for company housing
      [4, 0.476], // Residence Type: Dormitory
      [5, 0.575], // Representative's name and signature, or company name and seal
      [6, 0.83],  // The documents the provider hands over
    ],
  },
];

for (const j of JOBS) {
  const m = await sharp(SRC + j.src).metadata();
  const [fl, ft, fr, fb] = j.frame ?? [0, 0, 1, 1];
  const left = Math.round(m.width * fl);
  const top = Math.round(m.height * ft);
  const width = Math.round(m.width * fr) - left;
  const height = Math.round(m.height * fb) - top;
  let buf = await sharp(SRC + j.src).extract({ left, top, width, height }).png().toBuffer();

  if (j.markers) {
    const size = Math.round(width * 0.035);
    const gutter = Math.round(size * 1.6);
    buf = await sharp({
      create: { width: width + gutter, height, channels: 3, background: '#ffffff' },
    })
      .composite([
        { input: buf, left: gutter, top: 0 },
        ...j.markers.map(([n, fy]) => ({
          input: marker(n, size),
          left: Math.round((gutter - size) / 2),
          top: Math.round(height * fy - size / 2),
        })),
      ])
      .png()
      .toBuffer();
  }

  await sharp(buf)
    .resize({ width: Math.min(1200, j.markers ? width + Math.round(width * 0.072) : width), withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(OUT + j.out);
  const o = await sharp(OUT + j.out).metadata();
  console.log(j.out.padEnd(32) + `${m.width}x${m.height} → ${o.width}x${o.height}  ${(o.size / 1024).toFixed(0)}KB`);
}
