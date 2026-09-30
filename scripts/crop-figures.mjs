/**
 * Trims browser chrome off the published walkthrough figures.
 *
 * Why: a screenshot is mostly not the thing the figure is about. The Korea
 * Visa Portal puts a 300px "General Guide" nav down the left of every page and
 * a VISA NAVIGATOR advert under it; the e-Arrival and K-ETA forms sit in a
 * centred column with flat gutters either side. Published whole, the notice a
 * reader came for rendered at barely half the 768px prose column — small
 * enough that the surrounding empty space read louder than the text.
 *
 * Each row below is [file, expectedWidth, [left, top, right, bottom]], the
 * fractions being of the file's own dimensions. Only left and right do real
 * work: vertical trimming was tried and abandoned, because the gap above the
 * VISA NAVIGATOR advert is not reliably distinguishable from the gap above
 * the paragraph that matters, and cutting the wrong one loses the notice. expectedWidth is the guard:
 * the crop is skipped unless the file is still the size it was before this ran,
 * so running the script twice cannot crop twice. That matters more than it
 * sounds — the second crop of a 0.29 left edge takes another 29% off content,
 * and nothing about the result looks wrong enough to notice.
 *
 * Cropping is lossless here: no resample, just an extract. The files were
 * already at or under 1200px and the prose column is 768px, so every one of
 * them still renders at 1:1 or better after the trim.
 *
 * What is NOT cropped: the dimmed page behind a modal. That backdrop is what
 * makes a dialog read as a dialog — cut to the box alone and the figure could
 * be anything. Flat empty margin around it goes; the page behind does not.
 *
 * Masks are unaffected: they were burned in upstream, in
 * prepare-screenshots.mjs, and cropping cannot uncover what is already painted.
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';

const DIR = 'src/assets/entry/';

/* The Visa Portal nav gutter measured 75-77px on every page that carries it,
 * ending at 0.276-0.305 of the width. 0.30 clears it on all of them, and the
 * content card starts immediately after. */
const JOBS = [
  // ── Korea Visa Portal: a 240-340px "General Guide" nav down the left ─────
  // The cut is the layout gutter between that nav and the content card,
  // measured per file rather than assumed: it lands between 0.20 and 0.27 of
  // the width depending on how wide the capture was. Taking the gutter's START
  // rather than its end leaves the content's own left padding intact — cutting
  // at the end clipped the first letter of every line on the first attempt.
  ['biz-1-c34-general.png',            1158, [0.200, 0, 1.000, 1]],
  ['biz-2-c35-agreement.png',          1125, [0.200, 0, 1.000, 1]],
  ['biz-3-c36-sponsored.png',          1127, [0.200, 0, 1.000, 1]],
  ['biz-4-professional-category.png',  1101, [0.227, 0, 0.963, 1]],
  ['biz-5-c4-short-term-employee.png', 1183, [0.200, 0, 1.000, 1]],
  ['biz-6-evisa.png',                  1144, [0.209, 0, 0.919, 1]],
  ['biz-7-eform.png',                  1200, [0.213, 0, 1.000, 1]],
  ['biz-8-status-of-stay.png',         1200, [0.264, 0, 1.000, 1]],
  ['biz-9-inviting-company.png',       1154, [0.224, 0, 1.000, 1]],
  ['visa-1-by-purpose.png',            1098, [0.219, 0, 1.000, 1]],
  ['visa-2-short-visit-codes.png',     1101, [0.240, 0, 1.000, 1]],
  ['visa-3-c39-definition.png',        1140, [0.200, 0, 1.000, 1]],
  ['visa-8-how-to-apply.png',          1110, [0.236, 0, 1.000, 1]],

  // ── Flat margin only ─────────────────────────────────────────────────────
  // Every value here is a measured run of columns that vary by nothing at all,
  // top to bottom, less 6px kept as breathing room against the frame border.
  ['visa-4-form-page1.png',             634, [0.085, 0, 0.912, 1]],
  ['visa-5-details-of-visit.png',       635, [0.087, 0, 0.912, 1]],
  ['visa-6-notice.png',                 785, [0.087, 0, 0.921, 1]],
  ['visa-9-mission-requirements.png',   843, [0.051, 0, 0.923, 1]],
  ['visa-10-mission-status.png',        818, [0.032, 0, 0.928, 1]],
  ['eac-2-consent-email.png',           995, [0.074, 0, 0.943, 1]],
  ['eac-3-passport-upload.png',        1200, [0.118, 0, 0.922, 1]],
  ['eac-5-detailed-form.png',          1200, [0.038, 0, 0.895, 1]],
  ['eac-6-purpose.png',                1200, [0.085, 0, 0.927, 1]],
  ['eac-7-job-and-address.png',        1200, [0.078, 0, 0.887, 1]],
  ['eac-8-address-guide.png',          1200, [0.056, 0, 0.880, 1]],
  ['keta-2-consent.png',               1157, [0.022, 0, 0.978, 1]],
  ['keta-3-email-verify.png',          1200, [0.027, 0, 0.917, 1]],
  ['keta-4-gmail-warning.png',         1200, [0.053, 0, 0.897, 1]],
  ['keta-8-ocr-check.png',              565, [0.043, 0, 0.947, 1]],

  // ── Modal over a dimmed page: the backdrop stays, the empty edge goes ─────
  ['eac-4-scan-complete.png',          1200, [0.000, 0.00, 0.930, 1]],
  ['keta-5-upload-sample.png',          616, [0.000, 0.00, 0.905, 1]],
  ['keta-6-ai-warning.png',            1200, [0.000, 0.00, 0.970, 1]],
  // Top trim is the browser's own bookmark bar, which is in this frame and no
  // part of the tool being described.
  ['keta-7-crop-tool.png',             1200, [0.000, 0.03, 0.955, 1]],
];

let done = 0, skipped = 0;
for (const [file, expectW, [fl, ft, fr, fb]] of JOBS) {
  const path = DIR + file;
  if (!existsSync(path)) { console.warn(`  skip ${file}: not found`); skipped++; continue; }
  const m = await sharp(path).metadata();
  if (m.width !== expectW) {
    console.log(`  skip ${file}: ${m.width}px, expected ${expectW} — already cropped`);
    skipped++;
    continue;
  }
  const left = Math.round(m.width * fl);
  const top = Math.round(m.height * ft);
  const width = Math.round(m.width * fr) - left;
  const height = Math.round(m.height * fb) - top;
  const buf = await sharp(path).extract({ left, top, width, height })
    .png({ compressionLevel: 9, palette: true }).toBuffer();
  await sharp(buf).toFile(path);
  console.log(`  ${file.padEnd(33)} ${m.width}x${m.height} → ${width}x${height}`);
  done++;
}
console.log(`\ncropped ${done}, skipped ${skipped}`);
