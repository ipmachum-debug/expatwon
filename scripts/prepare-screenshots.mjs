/**
 * Turns raw walkthrough screenshots into the masked, sized files in
 * src/assets/entry/.
 *
 * Kept in the repo though the raw captures are not, because the masks are the
 * record: this file says exactly which rectangle of which screenshot was
 * covered, so a later reader can tell what was removed without ever needing
 * the unmasked original — and so the next batch of screenshots is masked the
 * same way rather than by eye.
 *
 * Sources live outside the repo on purpose. An unmasked passport bio page must
 * not enter git history, where deleting it later does nothing.
 *
 * Verify after running: sample the centre and corners of every box in the
 * OUTPUT and assert the mask colour. Do not check by looking at a contact
 * sheet — a scaled-down tile hid a nine-box misplacement here once already.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = '/home/user/expatwon/src/assets/entry/';
mkdirSync(OUT, { recursive: true });

/**
 * Masks are OPAQUE boxes, never blur. Blur on a short high-contrast string is
 * reversible in principle and looks reversible to a reader either way, which is
 * its own problem on a page about not altering documents.
 */
const JOBS = [
  // ── e-Arrival Card ───────────────────────────────────────────────────────
  { src: '/tmp/eac/shot-02.png', out: 'eac-1-home.png' },
  { src: '/tmp/eac/shot-05.png', out: 'eac-2-consent-email.png',
    mask: [[278, 436, 602, 46], [278, 486, 602, 46]] },
  { src: '/tmp/eac/shot-07.png', out: 'eac-3-passport-upload.png', cropTop: 28 },
  { src: '/tmp/eac/shot-08.png', out: 'eac-4-scan-complete.png',
    mask: [[152, 318, 140, 92], [356, 610, 258, 46], [956, 610, 258, 46],
           [356, 667, 394, 46], [356, 724, 394, 46], [356, 781, 394, 46]] },
  { src: '/tmp/eac/shot-10.png', out: 'eac-5-detailed-form.png' },
  { src: '/tmp/eac/shot-12.png', out: 'eac-6-purpose.png', cropTop: 40 },
  { src: '/tmp/eac/shot-13.png', out: 'eac-7-job-and-address.png', cropTop: 28, cropBottom: 107 },
  { src: '/tmp/eac/shot-17.png', out: 'eac-8-address-guide.png' },

  // ── K-ETA ────────────────────────────────────────────────────────────────
  { src: '/tmp/keta/k-01.png', out: 'keta-1-home.png' },
  { src: '/tmp/keta/k-05.png', out: 'keta-2-consent.png' },
  { src: '/tmp/keta/k-09.png', out: 'keta-3-email-verify.png',
    mask: [[305, 512, 585, 46], [305, 608, 290, 46]] },
  { src: '/tmp/keta/k-07.png', out: 'keta-4-gmail-warning.png', mask: [[346, 510, 152, 48]] },
  { src: '/tmp/keta/k-13.png', out: 'keta-5-upload-sample.png' },
  { src: '/tmp/keta/k-12.png', out: 'keta-6-ai-warning.png' },
  // The whole bio page is in frame here — photo, number, MRZ. Covered entirely;
  // the figure is about the three buttons under it, which survive.
  { src: '/tmp/keta/k-14.png', out: 'keta-7-crop-tool.png', cropTop: 22,
    mask: [[488, 273, 412, 349]] },
  { src: '/tmp/keta/k-15.png', out: 'keta-8-ocr-check.png',
    mask: [[152, 276, 366, 46], [152, 347, 366, 46], [155, 418, 110, 48],
           [155, 489, 360, 48], [155, 566, 360, 48]] },
  { src: '/tmp/keta/k-16.png', out: 'keta-9-not-eligible.png',
    mask: [[345, 62, 505, 52], [458, 290, 376, 36], [458, 576, 376, 60], [458, 652, 376, 60]] },
];

for (const j of JOBS) {
  const img = sharp(j.src);
  const m = await img.metadata();
  const top = j.cropTop ?? 0;
  const height = m.height - top - (j.cropBottom ?? 0);
  let p = sharp(j.src).extract({ left: 0, top, width: m.width, height });

  // TWO PASSES, and the reason is a sharp gotcha worth knowing: sharp applies
  // `resize` BEFORE `composite` whatever order you call them in. Masking and
  // resizing in one pipeline puts boxes drawn in source coordinates onto an
  // already-shrunk image, so every box lands offset by the scale factor —
  // 1.26x on a 1515px screenshot, which is the difference between covering a
  // passport number and covering the row under it. Mask at full size first,
  // then resize the result.
  if (j.mask) {
    p = p.composite(
      j.mask.map(([x, y, w, h]) => ({
        input: { create: { width: w, height: h, channels: 3, background: '#1f2937' } },
        left: x,
        top: y - top,
      })),
    );
  }
  const masked = await p.png().toBuffer();
  await sharp(masked)
    .resize({ width: Math.min(1200, m.width), withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toFile(OUT + j.out);
  const o = await sharp(OUT + j.out).metadata();
  console.log(j.out.padEnd(28) + `${o.width}x${o.height}  ${(o.size/1024).toFixed(0)}KB` + (j.maskAll ? '   ⚠ ' + j.maskAll + ' 미처리' : ''));
}
